import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import initFirebase from "./firebase.ts";

declare global {
  let __TARGET__: string;
}
if (__TARGET__ === "web") {
  initFirebase();
}

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
