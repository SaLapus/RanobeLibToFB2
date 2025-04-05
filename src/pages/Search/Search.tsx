import { useEffect, useState } from "react";

import { styled } from "@linaria/react";
import { SearchedCard } from "../../components/SearchedCard";
import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

// interface SearchProps {
// }

const width = 40;

// const Layout = styled.div``; // delete if not needed

const SearchInput = styled.input`
  --input-width: min(${width}em, 90vw);

  width: var(--input-width);
  margin-inline: calc(50% - var(--input-width) / 2);
`;
const ResultsLayout = styled.div`
  overflow-y: "scroll";
  height: "calc(100svh - 100px)"; // refactor
  padding: "24px";

  display: flex;
  flex-direction: column;
`;

export function Search() {
  const [q, setQuery] = useState("");
  // const [loading, setLoading] = useState(false);

  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);

  useEffect(() => {
    if (!q) return;

    // setLoading(true);

    void fetchQueryTitles(q).then((titles) => {
      // setLoading(false);
      setSearchedNovels(titles);
    });
  }, [q]);

  return (
    <>
      <SearchInput
        // onInput={() => setQuery}
        placeholder="Искать вашу любимую новеллу"
        // loading={loading}
      />
      <ResultsLayout>
        {searchedNovels.length > 0 &&
          searchedNovels.map((title) => (
            <SearchedCard key={title.id} novel={title} />
          ))}
      </ResultsLayout>
    </>
  );
}
