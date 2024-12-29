import { SearchBar } from "../../components/SearchBar";
import { fetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

import type { Pages } from "../../App";
import { useEffect, useState } from "react";
import { SNovels } from "../../components/SNovels";

interface SearchProps {
  to: (page: Pages) => void;
  onValue: (slug: string) => void;
}

export function Search({ to, onValue }: SearchProps) {
  const [q, setQuery] = useState("");
  const [searchedNovels, setSearchedNovels] = useState<fetchedQueryTitle[]>([]);
  // const [isActive, setActive] = useState(false);

  useEffect(() => {
    console.log("effect search");

    if (!q) return;

    fetchQueryTitles(q).then(setSearchedNovels);
  }, [q]);

  return (
    <>
      <SearchBar onValue={setQuery} />

      {searchedNovels.length > 0 && (
        <SNovels onValue={onValue} novels={searchedNovels} to={() => to("title")} />
      )}
    </>
  );
}
