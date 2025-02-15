/* eslint-disable no-debugger */

import mime from "./mimeBicycle";

import { fetch } from "@tauri-apps/plugin-http";

import * as Chapter from "../types/api/Chapter";
import * as FB2 from "../types/fb2";
import { ElemOrArr } from "../types/toolTypes";

export interface ChapterData {
  chapter: FB2.Chapter;
  binary: FB2.Binary[];
}

export default async function parseChapter(chapterInfo: Chapter.Data) {
  const chapterContent = chapterInfo.content;
  const binary: FB2.Binary[] = [];

  const fb2Chapter: FB2.Chapter = {
    section: {
      "#": [
        {
          title: {
            p: chapterInfo.name,
          },
        },
      ],
    },
  };

  switch (typeof chapterContent) {
    case "string": {
      const texts = (
        chapterContent.match(/<[a-z]+? [\s\S]*?\/[a-z]*?>/g) ?? [chapterContent]
      ).flatMap((str) => {
        return str
          .replaceAll(/<.?p.*?>/g, "")
          .replaceAll("&nbsp;", " ")
          .split("<br />\r\n")
          .map((str) => str.trim());
      });

      const elementsPromises = texts.map(async (text) => {
        let el: FB2.Paragraph | FB2.Image | FB2.EmptyLine;
        if (text.match(/<img [\s\S]*?\/>/)) {
          const [, src] = text.match(/<img [\s\S]*?src="([\s\S]*?)" \/>/)!;

          console.log(1);

          const image = await fetchImageAsFB2Binary(src);

          console.log(2);

          if (image) binary.push(image);

          el = {
            image: {
              "@l:href": `#${image?.["@id"]}`,
            },
          };
        } else if (text.length > 0) el = { p: text };
        else el = { "empty-line": {} };

        return el;
      });
      const elements = await Promise.allSettled(elementsPromises);

      elements.filter((el) => el.status === "rejected").forEach((el) => console.error(el.reason));

      fb2Chapter.section["#"].push(
        ...elements.filter((el) => el.status === "fulfilled").map((el) => el.value)
      );
      break;
    }
    case "object": {
      async function parseElement(
        el: Chapter.ChapterObjects
      ): Promise<ElemOrArr<FB2.MarkUpElements> | string> {
        switch (el.type) {
          case "doc": {
            return (await Promise.all(el.content.flatMap((par) => parseElement(par)))) as (
              | FB2.Paragraph
              | FB2.Image
            )[];
          }
          case "paragraph": {
            if (!el.content) return { "empty-line": {} };

            const parContent: (FB2.Paragraph | FB2.EmptyLine)[] = [];
            let parContentTemp: (string | FB2.Style)[] = [];
            const createPar: (elems: (string | FB2.Style)[]) => FB2.Paragraph = (elems) => ({
              p: {
                "#": elems,
              },
            });

            for (const paragraph of el.content) {
              const pEl = (await parseElement(paragraph)) as string | FB2.Style | FB2.EmptyLine;
              if (Object.keys(pEl).includes("empty-line")) {
                if (parContentTemp.length > 0) {
                  parContent.push(createPar(parContentTemp));
                  parContentTemp = [];
                }

                parContent.push(pEl as FB2.EmptyLine);
              } else parContentTemp.push(pEl as string | FB2.Style);
            }

            if (parContentTemp.length > 0) {
              parContent.push(createPar(parContentTemp));
              parContentTemp = [];
            }

            return parContent;
          }

          case "image": {
            return await Promise.all(
              el.attrs.images.map(async ({ image: image_src }) => {
                const path = chapterInfo.attachments.find(({ name }) => name === image_src)?.url;
                const src = "https://ranobelib.me" + path;

                if (!path) debugger;

                const image = await fetchImageAsFB2Binary(src);
                if (image) binary.push(image);

                const temp: FB2.Image = {
                  image: {
                    "@l:href": `#${image?.["@id"]}`,
                  },
                };

                return temp;
              })
            );
          }
          case "hardBreak": {
            return { "empty-line": {} };
          }
          case "text": {
            let pEl: string | FB2.Style = el.text;

            el.marks?.forEach(({ type }) => {
              switch (type) {
                case "italic":
                  pEl = {
                    emphasis: pEl,
                  };
                  break;
                case "bold":
                  pEl = {
                    strong: pEl,
                  };
                  break;
                default:
                  return;
              }
            });

            return pEl;
          }
          default:
            debugger;
            throw "Unknown element";
        }
      }

      fb2Chapter.section["#"].push(
        ...((await parseElement(chapterContent)) as (FB2.Paragraph | FB2.Image)[])
      );
      break;
    }
    default:
      debugger;
      throw "Unknown chapter content type";
  }

  return {
    chapter: fb2Chapter,
    binary,
  };
}

async function fetchImageAsFB2Binary(src: string) {
  const base64Image = await fetch(src)
    .then((res) => res.arrayBuffer())
    .then((buffer) =>
      btoa([...new Uint8Array(buffer)].map((char) => String.fromCharCode(char)).join(""))
    )
    .catch((e) => console.error(e));

  if (!base64Image) {
    console.error("No Image Bytes Received");
    return null;
  } else console.log("Image Bytes Received");

  return {
    "@id": await parseUrlToHash(src),
    "@content-type": mime.lookup(src),
    "#": base64Image,
  };
}

async function parseUrlToHash(src: string) {
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
