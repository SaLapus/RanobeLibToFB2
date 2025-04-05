/* stylelint-disable selector-pseudo-class-no-unknown */
/* stylelint-disable selector-pseudo-element-colon-notation */
import { useEffect, useState } from "react";

import "./App.css";

import Search from "./pages/Search";
import Title from "./pages/Title";

import { css } from "@linaria/core";
import { useInfoStore } from "./hooks/state/state";

export type Pages = "search" | "title";
const globals = css`
  :global() {
    :root {
      --color-primarly: #13c2c2;
      --color-selected-bg: #e6fffb;
      --color-hover: #36cfc9;
      --color-normal: #13c2c2;
      --color-click: #08979c;

      --f-color-link: #1677ff;
      --f-color-success: #52c41a;
      --f-color-warning: #faad14;
      --f-color-error: #f5222d;
    }

    /* html {
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    } */

    /* @font-face {
      font-family: "MaterialIcons";
      src: url(../assets/fonts/MaterialIcons.ttf) format("truetype");
    } */
  }
`;

/** TO DO
 * 1. NovelsListItem
 * - Rewrite to grid
 *
 * 2. TitleInfo
 * - Change color from basic
 *
 * 3. ChapterList
 * - Improve speed
 * - Find problem of re-renders
 *
 * 4. Search
 * - Strange lines when press Enter (media querys from ant?..)
 */

export default function App() {
  const [page, setPage] = useState<Pages>("search");

  const slug = useInfoStore((state) => state.slug);

  useEffect(() => {
    console.log("effect fetch title");

    console.log(slug);

    if (!slug) return;

    setPage("title");
  }, [slug]);

  return (
    <div className={globals}>
      <header>
        <h1 style={{ textAlign: "center", margin: "0" }}>FB2Creator</h1>
      </header>
      <main>{renderPage(page)}</main>
    </div>
  );
}

function renderPage(page: Pages) {
  switch (page) {
    case "title":
      return <Title />;

    case "search":
    default:
      return <Search />;
  }
}
