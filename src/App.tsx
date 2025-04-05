import { useEffect } from "react";

import "./App.css";

import Search from "./pages/Search";
import Title from "./pages/Title";

import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { useInfoStore } from "./hooks/state/state";

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

    html {
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
      height: 100%;
    }

    /* @font-face {
      font-family: "MaterialIcons";
      src: url(../assets/fonts/MaterialIcons.ttf) format("truetype");
    } */
  }
`;

const AppHeader = styled.header`
  &,
  & > * {
    text-align: center;
    margin-block: 0;
  }

  height: min-content;
`;

/** TO DO
 * 3. ChapterList
 * - Improve speed
 * - Find problem of re-renders
 *
 * 4. Errors
 * - Add modals when error occurs
 * - Add loading spinner when fetching data
 */

export default function App() {
  const slug = useInfoStore((state) => state.slug);

  useEffect(() => {
    console.log("effect fetch title");

    console.log(slug);
  }, [slug]);

  return (
    <div className={globals}>
      <AppHeader>
        <h1>FB2Creator</h1>
      </AppHeader>
      <main>{!slug ? <Search /> : <Title />}</main>
    </div>
  );
}
