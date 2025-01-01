import { Data as CI } from "../../types/api/ChaptersInfo";
import { TitleInfo as TI } from "../../types/api/Title";
import { Info } from "../Info";

interface TitleInfoProps {
  info: TI;
  chaptersInfo: CI[];
}

export default function TitleInfo({ info, chaptersInfo }: TitleInfoProps) {
  const author = info.authors.shift()?.name || "";

  return (
    <>
      <Info
        author={author}
        chaptersCount={chaptersInfo.length}
        format={info.model}
        published={info.releaseDateString}
        status={info.status.label}
        translateStatus={"&&&"}
        type={info.type.label}
      />
    </>
  );
}
