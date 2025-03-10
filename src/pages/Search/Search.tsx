import { SearchBar } from "../../components/SearchBar";
import { NovelsListItem } from "../../components/NovelsListItem";
import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

import { List } from "antd";

import { useEffect, useState } from "react";

// interface SearchProps {
// }

export function Search() {
  const [q, setQuery] = useState("");
  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);
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
        <List
          itemLayout="vertical"
          size="default"
          dataSource={searchedNovels}
          renderItem={(title) => <NovelsListItem novel={title} />}
          rowKey={"id"}
          style={{
            height: "100%",
            overflowY: "scroll",
          }}
        />
      )}
    </>
  );
}
