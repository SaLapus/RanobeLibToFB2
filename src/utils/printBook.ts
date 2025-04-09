/* eslint-disable no-debugger */

import sanitize from "sanitize-filename";
import { create } from "xmlbuilder2";

import { TitleInfo } from "../types/api/Title";
import * as FB2 from "../types/fb2";

export default function printBook(
  titleInfo: TitleInfo,
  volumeId: string,
  chapters: FB2.Chapter[],
  binary: FB2.Binary[] = []
) {
  const bookTemplate = {
    FictionBook: {
      "@xmlns": "http://www.gribuser.ru/xml/fictionbook/2.0",
      "@xmlns:l": "http://www.w3.org/1999/xlink",
      description: {
        "title-info": {
          author: {
            "first-name": titleInfo.authors[0]?.name.split(" ").shift(),
            "last-name": titleInfo.authors[0]?.name.split(" ").pop(),
          },
          "book-title": `${titleInfo.eng_name} ${volumeId}`,
          lang: "ru",
        },
      },
      body: {
        "#": chapters,
      },
      binary,
    },
  };

  debugger;

  const book = create(bookTemplate);
  const xml = book.end({ prettyPrint: false });

  saveFile(`${sanitize(`${titleInfo.eng_name} ${volumeId}`)}.fb2`, xml);
}

function saveFile(fileName: string, data: string, type = "application/fb2") {
  // Создаём Blob с переданными данными
  const blob = new Blob([data], { type });

  // Создаём временную ссылку на файл
  const url = URL.createObjectURL(blob);

  // Создаём элемент <a> для скачивания
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  // Автоматически "кликаем" по ссылке
  document.body.appendChild(a);
  a.click();

  // Удаляем временную ссылку и элемент <a>
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
