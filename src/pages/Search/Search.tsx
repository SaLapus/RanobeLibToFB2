import { styled } from "@linaria/react";
import { useEffect, useRef, useState } from "react";

import { SearchedCard } from "../../components/SearchedCard";
import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

// interface SearchProps {
// }

const width = 40;

const SearchContainer = styled.nav`
  --input-width: min(${width}em, 90vw);

  height: max-content;
  width: var(--input-width);
  margin-inline: calc(50% - var(--input-width) / 2);
  padding-block: 1em;

  display: grid;
  grid-template-columns: min-content minmax(80%, auto) min-content;
  grid-template-rows: max-content;

  place-content: center space-evenly;
`;

const SearchInput = styled.input``;

interface SpinnerProps {
  $loading: boolean;
}
const Spinner = styled.div<SpinnerProps>`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0 0 0 / 10%);
  border-top-color: var(--color-normal);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  display: ${(props) => (props.$loading ? "block" : "none")};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultsContainer = styled.div`
  overflow-y: scroll;

  padding: 1em;

  display: flex;
  flex-flow: column nowrap;
  row-gap: 0.5em;
  place-items: center center;
`;

export function Search() {
  const [q, setQuery] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);

  useEffect(() => {
    if (!q) return;

    setLoading(true);

    void fetchQueryTitles(q).then((titles) => {
      setLoading(false);
      setSearchedNovels(titles);
    });
  }, [q]);

  return (
    <>
      <SearchContainer>
        <label htmlFor="search">Поиск: </label>
        <SearchInput
          type={"search"}
          autoComplete={"off"}
          id={"search"}
          placeholder="Искать вашу любимую новеллу"
          onChange={(e) => {
            if (timer.current) clearTimeout(timer.current);

            timer.current = setTimeout(() => {
              timer.current = null;
              setQuery(e.target.value);
            }, 500);
          }}
        />
        <Spinner $loading={loading}></Spinner>
      </SearchContainer>

      <ResultsContainer>
        {searchedNovels.length > 0 &&
          searchedNovels.map((title) => (
            <SearchedCard key={title.id} novel={title} />
          ))}
      </ResultsContainer>
    </>
  );
}
