import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { useShallow } from "zustand/react/shallow";

import ChapterList from "../../components/ChapterList";
import { DownloadSettings } from "../../components/DownloadSettings";
import { TitleInfo } from "../../components/TitleInfo";

import { useInfoStore } from "../../hooks/state/state";
// import type { Pages } from "../../App";

// interface TitlePageProps {
//   // to: (page: Pages) => void;
// }

const Layout = styled.div`
  display: grid;
  height: 100vh;

  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 10px; /* Optional: Add some spacing between the grid items */

  overflow: scroll;

  /* height: 80%;
  width: 100%; */

  & > * {
    min-height: 0;
  }
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

export function Title(/* props: TitlePageProps */) {
  const [slug, titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.slug, state.titleInfo, state.chaptersInfo])
  );

  return slug && titleInfo && chaptersInfo ? (
    <Layout>
      <TitleInfo
        className={infoStyles}
        titleInfo={titleInfo}
        chaptersInfo={chaptersInfo}
      />

      <DownloadSettings
        className={downloadStyles}
        slug={slug}
        titleInfo={titleInfo}
        chaptersInfo={chaptersInfo}
      />
      <ChapterList className={chapterStyles} chaptersInfo={chaptersInfo} />
    </Layout>
  ) : (
    <div>⚙️Грузимся</div>
  );
}
