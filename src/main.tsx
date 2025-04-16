import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

declare global {
  const __TARGET__: string;
}
if (__TARGET__ === "web") {
  void import("./firebase.ts");
}

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
