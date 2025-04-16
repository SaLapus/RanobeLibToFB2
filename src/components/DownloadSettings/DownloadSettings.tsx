import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";

import { fetchChapter } from "../../utils/api";
import { groupBy } from "../../utils/cmpChapters";
import parseChapter from "../../utils/parseChapters";
import printBook from "../../utils/printBook";

import { Chapter, useInfoStore } from "../../hooks/state/state";

import type { TitleInfo } from "../../types/api/Title";

const container = css`
  overflow: hidden;
`;
const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

interface DowloadSettingsProps {
  className?: string;
  style?: CSSProperties;
  slug: string;
  titleInfo: TitleInfo;
  chapters: Record<number, Chapter>;
}
export default function DownloadSettings({
  className,
  style,
  slug,
  titleInfo,
}: DowloadSettingsProps) {
  const chapters = useInfoStore((state) => state.chapters);

  if (!slug) return null;

  return (
    // ИСПРАВИТЬ
    <div className={cx(className, container)} style={style}>
      <Button
        tabIndex={-1}
        onClick={() => {
          if (chapters) parseChapterList({ chapters, slug, titleInfo });
        }}
      >
        Скачать
      </Button>
    </div>
  );
}

interface PropsToParseChapters {
  chapters: Record<number, Chapter>;
  slug: string;
  titleInfo: TitleInfo;
}

function parseChapterList({ chapters, slug, titleInfo }: PropsToParseChapters) {
  const checkedChapters = Object.fromEntries(
    Object.entries(chapters).filter(([, chapter]) => chapter.checked)
  );

  void Object.entries(groupBy("volume", checkedChapters)).map(
    async ([volId, volume]) => {
      const dowloadedVolume = await Promise.all(
        volume.map((chapter) =>
          fetchChapter(slug, undefined, chapter.volume, chapter.number).then(
            parseChapter
          )
        )
      ).catch((reason) => {
        console.error(reason);

        throw new Error("Fetching chapters error");
      });

      printBook(
        titleInfo,
        volId,
        dowloadedVolume.map((chapter) => chapter.paragraphs),
        dowloadedVolume.flatMap((chapter) => chapter.binaries)
      );
    }
  );
}
