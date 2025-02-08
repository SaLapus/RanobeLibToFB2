import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import "./App.css";

import Search from "./pages/Search";
import Title from "./pages/Title";

import { useInfoStore } from "./hooks/state/state";

export type Pages = "search" | "title";

function App() {
  const [page, setPage] = useState<Pages>("search");

  const [slug, setSlug, fetchInfo] = useInfoStore(
    useShallow((state) => [state.slug, state.setSlug, state.fetchInfo])
  );

  useEffect(() => {
    console.log("effect fetch title");

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
        return <Search to={setPage} onValue={setSlug} />;
    }
  }
  return (
    <>
      <h1>FB2Creator</h1>
      <>{renderPage()}</>
    </>
  );
}

export default App;
