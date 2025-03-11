import { Input, Layout, List } from "antd";
import { useEffect, useState } from "react";

import { NovelsListItem } from "../../components/NovelsListItem";
import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

// interface SearchProps {
// }

export function Search() {
  const [q, setQuery] = useState("");
  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);
  // const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (!q) return;

    fetchQueryTitles(q).then(setSearchedNovels);
  }, [q]);

  return (
    <Layout>
      <Layout.Content
        style={{
          height: "100%",
        }}
      >
        <Input.Search
          allowClear={true}
          onSearch={setQuery}
          placeholder="Искать вашу любимую новеллу"
          style={{
            width: "20rem",
          }}
        />

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
      </Layout.Content>
    </Layout>
  );
}
