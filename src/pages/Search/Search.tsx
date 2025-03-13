import { Col, Input, Layout, Row } from "antd";
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
    <Layout.Content style={{}}>
      <Input.Search
        allowClear={true}
        onSearch={setQuery}
        placeholder="Искать вашу любимую новеллу"
        style={{
          width: "40rem",
          marginInline: "calc(50% - 40rem / 2)", // Выравнивание по центру
        }}
      />
      <Row
        align={"middle"}
        justify={"center"}
        gutter={[24, 12]}
        style={{
          overflowY: "scroll",
          height: "calc(100svh - 100px)",
          padding: "24px",

        }}
      >
        {searchedNovels.length > 0 &&
          searchedNovels.map((title) => (
            <Col key={title.id} span={13}>
              <NovelsListItem novel={title} />
            </Col>
          ))}
      </Row>
    </Layout.Content>
  );
}
