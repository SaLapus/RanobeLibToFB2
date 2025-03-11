import { Layout } from "antd";
import { useShallow } from "zustand/react/shallow";

import ChapterList from "../../components/ChapterList";
import { DownloadSettings } from "../../components/DownloadSettings";
import { TitleInfo } from "../../components/TitleInfo";

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
    <Layout>
      <Layout.Sider>
        <TitleInfo />
      </Layout.Sider>
      <Layout.Content>
        <DownloadSettings />
        <ChapterList />
      </Layout.Content>
    </Layout>
  ) : (
    <div>⚙️Грузимся</div>
  );
}
