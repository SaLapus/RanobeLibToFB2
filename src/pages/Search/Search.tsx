import { Col, Input, Layout, Row } from "antd";
import { useEffect, useState } from "react";

import { NovelsListItem } from "../../components/NovelsListItem";
import { FetchedQueryTitle, fetchQueryTitles } from "../../utils/api";

// interface SearchProps {
// }

const width = `min(${40}rem, 90vw)`;

export function Search() {
  const [q, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchedNovels, setSearchedNovels] = useState<FetchedQueryTitle[]>([]);

  useEffect(() => {
    if (!q) return;

    setLoading(true);

    fetchQueryTitles(q).then((titles) => {
      setLoading(false);
      setSearchedNovels(titles);
    });
  }, [q]);

  return (
    <Layout.Content style={{}}>
      <Input.Search
        allowClear={true}
        onSearch={setQuery}
        placeholder="Искать вашу любимую новеллу"
        loading={loading}
        style={{
          width,
          marginInline: `calc(50% - ${width} / 2)`, // Выравнивание по центру
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
