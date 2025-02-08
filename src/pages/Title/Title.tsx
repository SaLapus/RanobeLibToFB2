import { useShallow } from "zustand/react/shallow";

import { titlePage } from "./Title.module.css";

import { TitleInfo } from "../../components/TitleInfo";
import ChapterList from "../../components/ChapterList";
import { DownloadSettings } from "../../components/DownloadSettings";

import { useInfoStore } from "../../hooks/state/state";

// import type { Pages } from "../../App";

// interface TitlePageProps {
//   // to: (page: Pages) => void;
// }

export function Title(/* props: TitlePageProps */) {
  const [titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.titleInfo, state.chaptersInfo])
  );

  return titleInfo && chaptersInfo ? (
    <div className={titlePage}>
      <TitleInfo />
      <DownloadSettings />
      <ChapterList />
    </div>
  ) : (
    <div>⚙️Грузимся</div>
  );
}
