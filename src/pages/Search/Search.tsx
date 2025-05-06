import { styled } from "@linaria/react";
import { useRef, useState } from "react";

import { SearchedCard } from "../../components/SearchedCard";

import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";
import { Layout } from "../../utils/css/layers";

/** Search TODOs
 * Search Experience:
 * TODO: Add search suggestions/autocomplete
 * TODO: Implement search history
 * TODO: Add advanced search filters (by type, status, year)
 *
 * Performance:
 * TODO: Implement debouncing for search input
 * TODO: Cache recent search results
 * TODO: Add pagination for search results
 *
 * Error Handling:
 * TODO: Add proper error states for failed searches
 * TODO: Implement retry mechanism for failed API calls
 * TODO: Show meaningful error messages to users
 */

// interface SearchProps {
// }

const width = 40;

const SearchContainer = styled.nav`
  --input-width: min(${width}em, 90vw);

  height: ${Layout.Search.Bar};
  width: var(--input-width);
  margin-inline: calc(50% - var(--input-width) / 2);
  padding-block: 1em;

  display: grid;
  grid-template-columns: min-content minmax(80%, auto) min-content;
  grid-template-rows: max-content;

  place-content: center space-evenly;
`;
const SearchLayout = styled.div`
  display: grid;

  grid-template-rows: max-content auto;
  grid-template-columns: 1fr;
`;
const SearchInput = styled.input``;

interface SpinnerProps {
  "data-loading": boolean;
}
const Spinner = styled.div<SpinnerProps>`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0 0 0 / 10%);
  border-top-color: var(--color-normal);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  visibility: ${(props) => (props["data-loading"] ? "visible" : "hidden")};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultsContainer = styled.main`
  overflow-y: scroll;

  padding: 1em;

  display: flex;
  flex-flow: column nowrap;
  row-gap: 0.5em;
  place-items: center center;
`;

export function Search() {
  function setQuery(query: string) {
    if (query.length === 0) {
      setLoading(false);
      setSearchedNovels([]);
      return;
    }

    setLoading(true);

    void fetchQueryTitles(query).then((titles) => {
      setLoading(false);
      setSearchedNovels(titles);
    });
  }

  const timer = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);

  return (
    <SearchLayout>
      <SearchContainer>
        <label htmlFor="search">Поиск: </label>
        <SearchInput
          type={"search"}
          aria-label={"Поиск новеллы"}
          id={"search"}
          autoComplete={"off"}
          placeholder="Искать вашу любимую новеллу"
          onChange={(e) => {
            if (timer.current) clearTimeout(timer.current);

            timer.current = setTimeout(() => {
              timer.current = null;
              setQuery(e.target.value);
            }, 500);
          }}
        />
        <Spinner
          role={"status"}
          aria-label={"Загрузка"}
          data-loading={loading}
        />
      </SearchContainer>

      <ResultsContainer tabIndex={-1}>
        {searchedNovels.length > 0 &&
          searchedNovels.map((title) => (
            <SearchedCard key={title.id} novel={title} />
          ))}
      </ResultsContainer>
    </SearchLayout>
  );
}
