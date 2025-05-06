import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { useInfoStore } from "./hooks/state/state";
import { Layout } from "./utils/css/layers";

import Search from "./pages/Search";
import Title from "./pages/Title";

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

      --font-heading: #000000e0;
      --font-primary: #000000e0;
      --font-secondary: #000000a6;

      --border-color: #d9d9d9;
      --layout-color: #f5f5f5;
    }

    html {
      box-sizing: border-box;
      overflow: hidden;
      font-family: system-ui, sans-serif;
      color: var(--font-primary);
    }

    body {
      margin: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    /* @font-face {
      font-family: "MaterialIcons";
      src: url(../assets/fonts/MaterialIcons.ttf) format("truetype");
    } */
  }
`;

const AppLayout = styled.div`
  display: grid;

  grid-template-rows: ${Layout.App.Header} 1fr;
  grid-template-columns: 1fr;

  height: ${Layout.Body};
`;

const AppHeader = styled.header`
  &,
  & > * {
    text-align: center;
    margin-block: 0;
  }
`;

/** Global TODOs
 * Performance improvements:
 * TODO: Implement lazy loading for main components
 * TODO: Add proper loading states and transitions
 * TODO: Optimize re-renders with memo and useCallback
 *
 * Code organization:
 * TODO: Extract common styles to shared components
 * TODO: Create theme provider for consistent styling
 * TODO: Add error boundary components
 */

export default function App() {
  const slug = useInfoStore((state) => state.slug);

  return (
    <AppLayout className={globals}>
      <AppHeader>
        <h1 style={{ color: "var(--font-heading)" }}>FB2Creator</h1>
      </AppHeader>
      {!slug ? <Search /> : <Title />}
    </AppLayout>
  );
}
