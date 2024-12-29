import { TitleInfo } from "../../components/TitleInfo";

import { TitleInfo as TI } from "../../types/api/Title";
import { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { Pages } from "../../App";

interface TitlePageProps {
  to: (page: Pages) => void;
  slug: string;
  info: TI;
  chaptersInfo: ChapterInfo[];
}

export function Title({ slug, info, chaptersInfo }: TitlePageProps) {
  return slug ? (
    info && chaptersInfo ? (
      <TitleInfo info={info} chaptersInfo={chaptersInfo} />
    ) : (
      "⚙️Грузимся"
    )
  ) : undefined;
}
