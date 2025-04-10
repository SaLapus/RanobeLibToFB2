import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { useShallow } from "zustand/react/shallow";

import ChapterList from "../../components/ChapterList";
import { DownloadSettings } from "../../components/DownloadSettings";
import { TitleInfo } from "../../components/TitleInfo";

import { useInfoStore } from "../../hooks/state/state";

const Layout = styled.main`
  display: grid;
  height: 100%;

  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 10px;

  overflow: hidden;
`;

const infoStyles = css`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`;
const downloadStyles = css`
  grid-column: 1 / 2;
  grid-row: 2 / 4;
`;
const chapterStyles = css`
  grid-column: 2 / 3;
  grid-row: 1 / 4;
`;

export function Title() {
  const [slug, titleInfo, chapters] = useInfoStore(
    useShallow((state) => [state.slug, state.titleInfo, state.chapters])
  );

  return slug && titleInfo && chapters ? (
    <Layout>
      <TitleInfo
        className={infoStyles}
        titleInfo={titleInfo}
        chapters={chapters}
      />

      <DownloadSettings
        className={downloadStyles}
        slug={slug}
        titleInfo={titleInfo}
        chapters={chapters}
      />
      <ChapterList className={chapterStyles} chapters={chapters} />
    </Layout>
  ) : (
    <div>⚙️Грузимся</div>
  );
}
