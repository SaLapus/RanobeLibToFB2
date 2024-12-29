import { fetchedQueryTitle } from "../../utils/api";
import { SNovel } from "../SNovel";

import { container } from "./SNovels.module.css";

interface SNovelsProps {
  to: () => void;
  novels: fetchedQueryTitle[];
  onValue: (slug: string) => void;
}

export default function SNovels({ to, novels, onValue }: SNovelsProps) {
  return (
    <div
      className={container}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const slug = target.closest("[data-slug]")?.getAttribute("data-slug");
        if (slug) {
          console.log(slug);
          onValue(slug);
          to();
        }
      }}
    >
      {novels.map((novel) => (
        <SNovel novel={novel} key={novel.id} />
      ))}
    </div>
  );
}
