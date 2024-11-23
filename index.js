const { execSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const { create } = require("xmlbuilder2");
const sanitize = require("sanitize-filename");
const mime = require("mime-types");

const Awaiter = require("./awaiter");
const awaiter = new Awaiter({ cap: 50 });

const titleURL = "73129--mushoku-tensei-isekai-ittara-honki-dasu-ln";
const titleInfo = JSON.parse(
  execSync(
    `curl --location --globoff "https://api.mangalib.me/api/manga/${titleURL}?fields[]=summary&fields[]=authors&fields[]=artists" --header "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"`
  )
);

const chapters = JSON.parse(
  execSync(
    `curl --location "https://api.mangalib.me/api/manga/${titleURL}/chapters" --header "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"`
  )
);

console.time("Downloading");

Promise.allSettled(
  chapters.data.slice(-50).map(async (info, i) => {
    await awaiter.next();

    console.timeLog("Downloading", `: Start item ${i + 1}`);

    let chapter, binary;
    try {
      const ch = downloadChapter(info);
      chapter = ch.chapter;
      binary = ch.binary;
    } catch (e) {
      console.error(e);
    }

    console.timeLog("Downloading", `: End item ${i + 1}`);

    return {
      volumeId: info.volume,
      chapterId: info.number,
      chapter,
      binary,
    };
  })
)
  .then((chapters) => {
    lvl1Tags;
    debugger;
    const volumes = new Map();
    chapters.forEach(({ value }) => {
      const { volumeId, chapter, binary } = value;

      const vol = volumes.get(volumeId);
      if (vol) {
        vol.chapters.push(chapter);
        vol.binary.push(...binary);
      } else
        volumes.set(volumeId, {
          volumeId,
          chapters: chapter ? [chapter] : [],
          binary: binary ?? [],
        });
    });

    volumes.forEach(({ volumeId, chapters, binary }) => {
      printBook(volumeId, chapters, binary);
    });
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    console.timeEnd("Downloading");
  });

/* const chaptersChunksToDownload = [];

// for (let i = 0; i < chapters.data.length; i += 51)
// chaptersChunksToDownload.push(chapters.data.slice(i, i + 50));
*/

const lvl1Tags = new Set();
const attrs = new Map();

function downloadChapter(chapter) {
  const chapterInfo = JSON.parse(
    execSync(
      `curl --location "https://api.mangalib.me/api/manga/${titleURL}/chapter?branch_id=9008&number=${chapter.number}&volume=${chapter.volume}" --header "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"`
    )
  );

  const chapterContent = chapterInfo.data.content;
  const binary = [];

  const fb2Chapter = {
    section: {
      "#": [
        {
          title: {
            p: chapterInfo.data.name,
          },
        },
      ],
    },
  };

  switch (typeof chapterContent) {
    case "string":
      const texts = (
        chapterContent.match(/<[a-z]+? [\s\S]*?\/[a-z]*?>/g) ?? [chapterContent]
      ).flatMap((str) => {
        return str
          .replaceAll(/<.?p.*?>/g, "")
          .replaceAll("&nbsp;", " ")
          .split("<br />\r\n")
          .map((str) => str.trim());
      });

      texts.forEach((text) => {
        let el;
        if (text.match(/<img [\s\S]*?\/>/)) {
          const [, src] = text.match(/<img [\s\S]*?src="(\S*?)" \/>/);

          const name = path.parse(src).name;
          const id = `img_${crypto.createHash("md5").update(name).digest("hex").slice(0, 16)}`;

          // binary.push({
          //   "@id": id,
          //   "@content-type": mime.lookup(src),
          //   "#": Buffer.from(
          //     execSync(`curl --location ${src}`, {
          //       maxBuffer: 20 * 1024 * 1024,
          //     })
          //   ).toString("base64"),
          // });

          el = {
            image: {
              "@l:href": `#${id}`,
            },
          };
        } else if (!!text) el = { p: text };
        else el = { "empty-line": {} };

        fb2Chapter.section["#"].push(el);
      });
      break;
    case "object":
      function parseElement(el) {
        switch (el.type) {
          case "doc":
            return el.content.flatMap((par) => {
              lvl1Tags.add(par.type);
              parseElement(par);
            });
          case "paragraph":
            if (el.attrs)
              Object.keys(el.attrs).forEach((n) => {
                const attr = attrs.get(n);
                if (!attr) attrs.set(n, new Set([el.attrs[n]]));
                else attr.add(el.attrs[n]);
              });

            if (!el.content) return { "empty-line": {} };

            let parContent = [];
            let parContentTemp = [];
            const createPar = (elems) => ({
              p: {
                "#": elems,
              },
            });

            try {
              [...el.content];
            } catch (e) {
              const a = el.content;
              debugger;
            }

            for (par of el.content) {
              const pEl = parseElement(par);
              if (Object.keys(pEl).includes("empty-line")) {
                if (parContentTemp.length > 0) {
                  parContent.push(createPar(parContentTemp));
                  parContentTemp = [];
                }
                parContent.push(pEl);
              } else parContentTemp.push(pEl);
            }

            if (parContentTemp.length > 0) {
              parContent.push(createPar(parContentTemp));
              parContentTemp = [];
            }

            return parContent;

          case "image":
            return el.attrs.images.map(({ image }) => {
              const path = chapterInfo.data.attachments.find(({ name }) => name === image)?.url;
              const url = "https://ranobelib.me" + path;

              if (!path) debugger;

              const id = `img_${crypto.createHash("md5").update(image).digest("hex").slice(0, 16)}`;

              // binary.push({
              //   "@id": id,
              //   "@content-type": mime.lookup(path),
              //   "#": Buffer.from(
              //     execSync(`curl --location ${url}`, {
              //       maxBuffer: 20 * 1024 * 1024,
              //     })
              //   ).toString("base64"),
              // });

              return {
                image: {
                  "@l:href": `#${id}`,
                },
              };
            });

          case "hardBreak":
            return { "empty-line": {} };
          case "text":
            let pEl = el.text;

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
          default:
            const a = chapterInfo.data.content;
            debugger;
        }
      }

      fb2Chapter.section["#"].push(...parseElement(chapterContent));
      break;
    default:
      const a = chapterInfo.data.content;
      debugger;
  }

  return {
    chapter: fb2Chapter,
    binary,
  };
}

const printBook = (volumeId, chapters, binary = []) => {
  const bookTemplate = {
    FictionBook: {
      "@xmlns": "http://www.gribuser.ru/xml/fictionbook/2.0",
      "@xmlns:l": "http://www.w3.org/1999/xlink",
      description: {
        "title-info": {
          author: {
            "first-name": titleInfo.data.authors[0].name.split(" ").shift(),
            "last-name": titleInfo.data.authors[0].name.split(" ").pop(),
          },
          "book-title": `${titleInfo.data.eng_name} ${volumeId}`,
          lang: "ru",
        },
      },
      body: {
        "#": chapters,
      },
      binary,
    },
  };

  const book = create(bookTemplate);
  const xml = book.end({ prettyPrint: true });

  writeFileSync(
    `./books/${sanitize(`${titleInfo.data.eng_name}`)}/${sanitize(
      `${titleInfo.data.eng_name} ${volumeId}`
    )}.fb2`,
    xml
  );
};
