import { CSSProperties, styled } from "@linaria/react";


import { fetchChapter } from "../../utils/api";
import { sortChapters } from "../../utils/cmpChapters";
import parseChapter from "../../utils/parseChapters";
import printBook from "../../utils/printBook";

import { useChapterStore } from "../../hooks/state/state";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";

interface DowloadSettingsProps {
  className?: string;
  style?: CSSProperties;
  slug: string;
  titleInfo: TitleInfo;
  chaptersInfo: ChapterInfo[];
}

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

export default function DownloadSettings({
  className,
  style,
  slug,
  titleInfo,
}: DowloadSettingsProps) {
  const chapters = useChapterStore((state) => state.chapters);

  if (!slug) return null;

  return (
    // ИСПРАВИТЬ
    <div className={className} style={style}>
      <Button
        onClick={() => {
          parseChapterList({ chapters, slug, titleInfo });
        }}
      >
        Скачать
      </Button>
    </div>
  );
}

interface PropsToParseChapters {
  chapters: Map<number, ChapterInfo[]>;
  slug: string;
  titleInfo: TitleInfo;
}

// Refactor to Promise#allSettled
function parseChapterList({ chapters, slug, titleInfo }: PropsToParseChapters) {
  Array.from(chapters)
    .map(
      ([vol, ch]): [
        number,
        Promise<Awaited<ReturnType<typeof parseChapter>>[]>
      ] => {
        return [
          vol,
          Promise.all(
            ch.toSorted(sortChapters("onlyByChapters")).map(async (c) => {
              const chapters = await fetchChapter(
                slug,
                undefined,
                c.volume,
                c.number
              );
              return parseChapter(chapters);
            })
          ),
        ];
      }
    )
    .forEach(([vol, promisedChapters]) => {
      void (async () => {
        const chs = await promisedChapters;

        // eslint-disable-next-line no-debugger
        debugger;
        printBook(
          titleInfo,
          vol.toString(),
          chs.map((c) => c.chapter),
          chs.flatMap((c) => c.binary)
        );
      })();
    });
}
