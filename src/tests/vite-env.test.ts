import { describe, expect, it } from "vitest";

describe("Environment type definitions", () => {
  it("has the correct environment variables defined", () => {
    const env = import.meta.env;

    // Verify environment variable types are correct
    expect(typeof env.VITE_APP_TITLE).toBe("string");
    expect(typeof env.FIREBASE_API_KEY).toBe("string");
    expect(typeof env.FIREBASE_AUTH_DOMAIN).toBe("string");
    expect(typeof env.FIREBASE_PROJECT_ID).toBe("string");
    expect(typeof env.FIREBASE_STORAGE_BUCKET).toBe("string");
    expect(typeof env.FIREBASE_MESSAGING_SENDER_ID).toBe("string");
    expect(typeof env.FIREBASE_APP_ID).toBe("string");
    expect(typeof env.FIREBASE_MEASUREMENT_ID).toBe("string");
  });
});
