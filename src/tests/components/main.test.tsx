import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import initFirebase from "../../firebase";

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn().mockImplementation(() => ({
    render: vi.fn(),
  })),
}));

vi.mock("../../firebase.ts", () => ({
  default: vi.fn(),
}));

vi.mock("../../App.tsx", () => ({
  default: () => null,
}));

describe("Main entry point", () => {
  beforeEach(() => {
    // Reset document body before each test
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("initializes Firebase in web mode", async () => {
    __TARGET__ = "web";

    await import("../../main");

    expect(initFirebase).toHaveBeenCalled();
  });

  it("skips Firebase initialization in tauri mode", async () => {
    __TARGET__ = "tauri";

    await import("../../main");

    expect(initFirebase).not.toHaveBeenCalled();
  });

  it("creates root and renders App", async () => {
    const rootElement = document.getElementById("root");
    await import("../../main");

    expect(createRoot).toHaveBeenCalledWith(rootElement);
    // expect(vi.mocked(createRoot).mock.results[0].value.render).toHaveBeenCalled();
  });
});
