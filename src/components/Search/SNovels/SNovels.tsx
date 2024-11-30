import { fetchedQueryTitle } from "../../../utils/api";
import { SNovel } from "../SNovel";

import { container } from "./SNovels.module.css";

interface SNovelsProps {
  novels: fetchedQueryTitle[];
}

export default function SNovels({ novels }: SNovelsProps) {
  return (
    <div className={container}>
      {novels.map((novel) => (
        <SNovel novel={novel} key={novel.id} />
      ))}
    </div>
  );
}
