/* eslint-disable no-debugger */

import { fetch } from "@tauri-apps/plugin-http";

import mime from "./mimeBicycle";

import * as Chapter from "../types/api/Chapter";
import { AllNodes, Doc, Mark } from "../types/api/Chapter";
import * as FB2 from "../types/fb2";

type XMLNode = Record<
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

export interface ChapterData {
  chapter: FB2.Chapter;
  binary: FB2.Binary[];
}

export default async function parseChapter(info: Chapter.Data) {
  const { name, content, attachments } = info;

  switch (typeof content) {
    case "string":
      parseTextContent(content);
      break;
    case "object":
      if (Object.hasOwn(content, "type") && content.type === "doc") {
        parseDocContent(content);
      }
      throw new Error("UNKNOWN CONTENT TYPE");
    default:
      throw new Error("UNKNOWN CONTENT TYPE");
  }

  return [
    {
      section: {
        "#": [],
      },
    },
  ];
}

function parseTextContent(this: ImagesContext | void, content: string) {
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
          const [, id, ext] = /<img [\s\S]*?src="([\S]*?)\.(\w+)" \/>/.exec(
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

async function fetchImageAsFB2Binary(src: string) {
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

  if (!base64Image) {
    console.error("No Image Bytes Received");
    return null;
  } else console.log("Image Bytes Received");

  return {
    "@id": await reduceNameToHash(src),
    "@content-type": mime.lookup(src),
    "#": base64Image,
  };
}

async function reduceNameToHash(src: string) {
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

export function parseDocContent(doc: Doc): [(string | XMLNode)[], string[]] {
  const context: ImagesContext = { imageIDs: [], imagesSRCs: [] };

  const pNode = parseNode.bind(context);

  const nodes = doc.content.map((node) => pNode(node));

  return [nodes, context.imageIDs];
}
