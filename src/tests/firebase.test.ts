import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { describe, expect, it, vi } from "vitest";
import initFirebase from "../firebase";

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn().mockReturnValue("mockApp"),
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn().mockReturnValue("mockAnalytics"),
}));

describe("Firebase initialization", () => {
  it("initializes firebase app with correct configuration", () => {
    initFirebase();

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: expect.any(String) as string,
      authDomain: expect.any(String) as string,
      projectId: expect.any(String) as string,
      storageBucket: expect.any(String) as string,
      messagingSenderId: expect.any(String) as string,
      appId: expect.any(String) as string,
      measurementId: expect.any(String) as string,
    });
  });

  it("initializes analytics", () => {
    const result = initFirebase();

    expect(getAnalytics).toHaveBeenCalled();
    expect(result).toEqual({
      app: "mockApp",
      analytics: "mockAnalytics",
    });
  });
});
