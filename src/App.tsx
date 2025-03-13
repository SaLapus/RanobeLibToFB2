import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import "./App.css";

import { ConfigProvider, Layout, theme } from "antd";

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
        return <Title />;

      case "search":
      default:
        return <Search />;
    }
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#31daad",
          colorTextSecondary: "#1d92d1",
        },
        components: {
          Layout: {
            headerBg: "#13a8a8",
            algorithm: true
          },
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{}}>
        <Layout.Header>
          <h1 style={{ textAlign: "center", margin: "0" }}>FB2Creator</h1>
        </Layout.Header>
        {renderPage()}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
