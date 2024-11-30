import { useEffect, useState } from "react";

import { Search } from "./components/Search";

import { fetchTitleInfo, fetchChaptersInfo } from "./utils/api";
import { TitleInfo as TS } from "./types/api/Title";
import { Data as ChapterInfo } from "./types/api/ChaptersInfo";

import "./App.css";
import { TitleInfo } from "./components/TitleInfo";

function App() {
  const [slug, setSlug] = useState("");

  const [info, setInfo] = useState<TS>();
  const [chaptersInfo, setChaptersInfo] = useState<ChapterInfo[]>();

  useEffect(() => {
    console.log("effect");
    
    fetchTitleInfo(slug).then(setInfo);
    fetchChaptersInfo(slug).then(setChaptersInfo);
  }, [slug]);

  return (
    <>
      <Search onValue={setSlug} />
      {(slug && info && chaptersInfo) ? <TitleInfo info={info} chaptersInfo={chaptersInfo} /> : "⚙️Грузимся"}
    </>
  );
}

export default App;
