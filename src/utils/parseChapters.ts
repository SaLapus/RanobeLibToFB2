import { fetch } from "@tauri-apps/plugin-http";

import mime from "./mimeBicycle";

import * as Chapter from "../types/api/Chapter";
import { AllNodes, Mark } from "../types/api/Chapter";

export type XMLNode = Record<
  string,
  {
    "@"?: Record<string, string>;
    "#"?: string | XMLNode | (string | XMLNode)[];
  }
>;
interface ImagesContext {
  imageIDs: string[];
  imagesSRCs: string[];
}

export interface ParsedChapter {
  paragraphs: XMLNode;
  binaries: XMLNode[];
}

export default async function parseChapter(
  info: Chapter.Data
): Promise<ParsedChapter> {
  const { name, content, attachments } = info;

  const context: ImagesContext = { imageIDs: [], imagesSRCs: [] };
  let nodes: (string | XMLNode)[] = [];
  try {
    switch (typeof content) {
      case "string":
        {
          const pTNode = parseTextContent.bind(context);

          nodes = pTNode(content);
        }
        break;
      case "object":
        if (Object.hasOwn(content, "type") && content.type === "doc") {
          const pNode = parseNode.bind(context);

          nodes = content.content.map((node) => pNode(node));
        }
        throw new Error("UNKNOWN CONTENT TYPE");
      default:
        throw new Error("UNKNOWN CONTENT TYPE");
    }
  } catch (e) {
    console.error(e);

    return {
      paragraphs: {},
      binaries: [],
    };
  }

  const binaries: XMLNode[] = [];

  if (context.imagesSRCs.length > 0) {
    const images = await Promise.all(
      context.imagesSRCs.map(async (src) => {
        const name =
          context.imageIDs.find((id) => src.includes(id)) ??
          /\S+(?=\.)/gm.exec(src)![0];

        return fetchImageAsFB2Binary(src, name);
      })
    );

    binaries.concat(images.filter((node) => !!node));
  } else if (context.imageIDs.length > 0) {
    const images = await Promise.all(
      context.imageIDs.map(async (id) => {
        const image = attachments.find((att) => att.name === id);
        if (image) return fetchImageAsFB2Binary(image.url, id);
      })
    );

    binaries.concat(images.filter((node) => !!node));
  }

  return {
    paragraphs: {
      section: {
        "#": [
          {
            title: {
              "#": name,
            },
          },
          ...nodes,
        ],
      },
    },

    binaries,
  };
}

function parseTextContent(
  this: ImagesContext | void,
  content: string
): XMLNode[] {
  // Add validation for tags
  // Check for unknown tags
  const texts = (
    content.match(/<[a-z]+? [\s\S]*?\/[a-z]*?>/g) ?? [content]
  ).flatMap((str) => {
    return str
      .replaceAll(/<.?p.*?>/g, "")
      .replaceAll("&nbsp;", " ")
      .split("<br />\r\n")
      .map((str) => str.trim());
  });

  const elements = texts.map((text) => {
    let el: XMLNode = { "empty-line": {} };

    if (/<img [\s\S]*?\/>/.test(text)) {
      try {
        if (this) {
          const [, id, ext] = /<img [\s\S]*?src="[\S\s]*\/([\S\s]*)\.(\w+)" \/>/.exec(
            text
          )!;

          this.imagesSRCs.push(`${id}.${ext}`);
          this.imageIDs.push(id);

          el = {
            image: {
              "@": { "l:href": `#${id}` },
            },
          };
        }
      } catch (e) {
        console.error(text);
        console.error(e);

        el = {
          image: {
            "@": { "data-message": "Error" },
          },
        };
      }
    } else if (text.length > 0)
      el = {
        p: {
          "#": text,
        },
      };

    return el;
  });

  return elements;
}

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}
async function fetchImageAsFB2Binary(
  src: string,
  name: string
): Promise<XMLNode> {
  try {
    if (!window.__TAURI_INTERNALS__) throw new Error("NOT TAURI APP");
    const base64Image = await fetch(src)
      .then((res) => res.arrayBuffer())
      .then((buffer) =>
        btoa(
          [...new Uint8Array(buffer)]
            .map((char) => String.fromCharCode(char))
            .join("")
        )
      )
      .catch((e) => console.error(e));

    if (!base64Image) throw new Error("No Image Bytes Received");
    const contentType = mime.lookup(src);
    if (!contentType) throw new Error("No Content-Type for Image");

    return {
      binary: {
        "@": {
          id: name,
          "content-type": contentType,
        },
        "#": base64Image,
      },
    };
  } catch (e) {
    console.error(e);

    return {
      binary: {},
    };
  }
}

function parseMarks(text: string, marks?: Mark[]): string | XMLNode {
  if (!marks || marks.length === 0) return text;

  return marks.reduce<string | XMLNode>((node, mark) => {
    switch (mark.type) {
      case "bold":
        return { strong: { "#": node } };
      case "italic":
        return { emphasis: { "#": node } };
      default:
        return node;
    }
  }, text);
}

function parseNode(
  this: ImagesContext | void,
  node: AllNodes
): string | XMLNode {
  switch (node.type) {
    case "doc":
      return {
        section: {
          "#": node.content.flatMap<string | XMLNode>((child) =>
            parseNode(child)
          ),
        },
      };

    case "paragraph": {
      const content = node.content.flatMap<string | XMLNode>((child) =>
        parseNode(child)
      );
      if (node.attrs?.textAlign === "center") {
        return {
          p: {
            "#": [
              {
                // Rewrite. Im not sure all center aligned paragraphs are titles.
                subtitle: {
                  "#": content,
                },
              },
            ],
          },
        };
      }
      return {
        p: {
          "#": content,
        },
      };
    }

    case "heading": {
      const content = node.content?.map((child) => parseNode(child)) || [];
      return node.attrs.level === 1
        ? {
            title: {
              "#": content,
            },
          }
        : {
            subtitle: {
              "#": content,
            },
          };
    }

    case "image": {
      if (this) {
        this.imageIDs.push(node.attrs.images[0].image);

        return {
          image: {
            "@": {
              "l:href": `#${node.attrs.images[0].image}`,
            },
          },
        };
      }
      throw new Error("NO IMAGE ID");
    }

    case "hardBreak":
      return {
        "empty-line": {},
      };

    case "text":
      return parseMarks(node.text, node.marks);

    default:
      console.error("Unknown node");
      console.error(node);

      return {};
  }
}

// Old id generator
export async function reduceNameToHash(src: string) {
  const parsedUrl = new URL(src);

  const pathname = parsedUrl.pathname;
  const name = pathname.substring(pathname.lastIndexOf("/") + 1);

  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const first16Bytes = new Uint8Array(hashBuffer).slice(0, 16);
  const hashHex = Array.from(first16Bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `img_${hashHex}`;
}
