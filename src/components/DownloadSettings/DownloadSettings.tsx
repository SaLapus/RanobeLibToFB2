import { Button } from "antd";
import { useShallow } from "zustand/react/shallow";

import { downloadSettings } from "../../pages/Title/Title.module.css";

import { fetchChapter } from "../../utils/api";
import parseChapter from "../../utils/parseChapters";
import printBook from "../../utils/printBook";

import { useChapterStore, useInfoStore } from "../../hooks/state/state";

import { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import { TitleInfo } from "../../types/api/Title";
import { sortChapters } from "../../utils/cmpChapters";

export default function DownloadSettings() {
  const [slug, titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.slug, state.titleInfo, state.chaptersInfo])
  );
  const chapters = useChapterStore((state) => state.chapters);

  if (!(slug && titleInfo && chaptersInfo)) return null;

  return (

    // ИСПРАВИТЬ
    <div className={downloadSettings}>
      <Button onClick={() => parseChapterList({ chapters, slug, titleInfo })}>Скачать</Button>
    </div>
  );
}

interface PropsToParseChapters {
  chapters: Map<number, ChapterInfo[]>;
  slug: string;
  titleInfo: TitleInfo;
}

async function parseChapterList({ chapters, slug, titleInfo }: PropsToParseChapters) {
  Array.from(chapters)
    .map(([vol, ch]): [number, Promise<Awaited<ReturnType<typeof parseChapter>>[]>] => {
      return [
        vol,
        Promise.all(
          ch.sort(sortChapters("onlyByChapters")).map(async (c) => {
            const chapters = await fetchChapter(slug, undefined, c.volume, c.number);
            return await parseChapter(chapters);
          })
        ),
      ];
    })
    .forEach(async ([vol, promisedChapters]) => {
      const chs = await promisedChapters;

      // eslint-disable-next-line no-debugger
      debugger;
      printBook(
        titleInfo,
        vol.toString(),
        chs.map((c) => c.chapter),
        chs.flatMap((c) => c.binary)
      );
    });
}
