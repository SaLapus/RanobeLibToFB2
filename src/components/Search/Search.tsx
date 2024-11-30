import { useState } from "react";
import { fetchedQueryTitle, fetchQueryTitles } from "../../utils/api";
import { SNovels } from "./SNovels";

interface SearchProps {
  onValue: (slug: string) => void;
}

export default function Search({ onValue }: SearchProps) {
  const [q, setQuery] = useState("");
  const [searchedNovels, setSearchedNovels] = useState<fetchedQueryTitle[]>([]);
  const [isActive, setActive] = useState(false);

  return (
    <div
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const slug = target.closest("[data-slug]")?.getAttribute("data-slug");
        if (slug) {
          console.log(slug);
          onValue(slug);
        }
      }}
    >
      <input
        type="search"
        name="novelSearch"
        id="q"
        placeholder="Искать вашу любимую новеллу"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setTimeout(() => setActive(false), 100)}
      />
      <button
        onClick={() => {
          fetchQueryTitles(q).then(setSearchedNovels);
          setActive(true);
        }}
      >
        Найти
      </button>
      {isActive && <SNovels novels={searchedNovels} />}
    </div>
  );
}
