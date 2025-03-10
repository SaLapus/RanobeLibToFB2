import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import "./App.css";

import { ConfigProvider, Layout } from "antd";

import Search from "./pages/Search";
import Title from "./pages/Title";

import { useInfoStore } from "./hooks/state/state";

export type Pages = "search" | "title";

function App() {
  const [page, setPage] = useState<Pages>("search");

  const [slug, fetchInfo] = useInfoStore(useShallow((state) => [state.slug, state.fetchInfo]));

  useEffect(() => {
    console.log("effect fetch title");

    console.log(slug);

    if (!slug) return;
    fetchInfo(slug);

    setPage("title");
  }, [slug, fetchInfo]);

  function renderPage() {
    switch (page) {
      case "title":
        return <Title /* to={setPage} */ />;

      case "search":
      default:
        return <Search />;
    }
  }
  return (
    <ConfigProvider>
      <Layout
        style={{
          height: "100%",
        }}
      >
        <Layout.Header>
          <h1>FB2Creator</h1>
        </Layout.Header>
        <Layout.Content
          style={{
            height: "100%",
          }}
        >
          <>{renderPage()}</>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
