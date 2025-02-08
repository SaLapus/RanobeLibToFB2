import { useShallow } from "zustand/react/shallow";

import { downloadSettings } from "../../pages/Title/Title.module.css";

import { fetchChapter } from "../../utils/api";
import parseChapter from "../../utils/parseChapters";
import printBook from "../../utils/printBook";

import { useInfoStore, useChapterStore } from "../../hooks/state/state";
import { sortChapters } from "../../utils/cmpChapters";

export default function DownloadSettings() {
  const [slug, titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.slug, state.titleInfo, state.chaptersInfo])
  );
  const chapters = useChapterStore((state) => state.chapters);

  if (!(slug && titleInfo && chaptersInfo)) return null;

  return (
    <div className={downloadSettings}>
      <button
        onClick={async () => {
          Array.from(chapters)
            .map(([vol, ch]): [number, Promise<Awaited<ReturnType<typeof parseChapter>>[]>] => {
              return [
                vol,
                Promise.all(
                  ch
                    .sort(sortChapters("onlyByChapters"))
                    .map(
                      async (c) =>
                        await fetchChapter(slug, undefined, c.volume, c.number).then(parseChapter)
                    )
                ),
              ];
            })
            .forEach(async ([vol, promisedChapters]) => {
              const chs = await promisedChapters;
              printBook(
                titleInfo,
                vol.toString(),
                chs.map((c) => c.chapter),
                chs.flatMap((c) => c.binary)
              );
            });
        }}
      >
        Скачать
      </button>
    </div>
  );
}
