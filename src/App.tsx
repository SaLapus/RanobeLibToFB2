import { useEffect, useState } from "react";

import Search from "./pages/Search";

import { fetchTitleInfo, fetchChaptersInfo } from "./utils/api";

import { TitleInfo as TI } from "./types/api/Title";
import { Data as ChapterInfo } from "./types/api/ChaptersInfo";

import "./App.css";
import Title from "./pages/Title";

export type Pages = "search" | "title";

function App() {
  const [slug, setSlug] = useState("");

  const [page, setPage] = useState<Pages>("search");

  const [info, setInfo] = useState<TI>();
  const [chaptersInfo, setChaptersInfo] = useState<ChapterInfo[]>();

  useEffect(() => {
    console.log("effect fetch title");

    if (!slug) return;

    fetchTitleInfo(slug).then(setInfo);
    fetchChaptersInfo(slug).then(setChaptersInfo);
  }, [slug]);

  function renderPage() {
    switch (page) {
      case "title":
        return (
          info &&
          chaptersInfo && <Title to={setPage} slug={slug} info={info} chaptersInfo={chaptersInfo} />
        );
      case "search":
      default:
        return <Search to={setPage} onValue={setSlug} />;
    }
  }
  return <>
    <h1>FB2Creator</h1>
    <>{renderPage()}</>
  </>;
}

export default App;
