import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect, vi } from "vitest";

// Add custom matchers
expect.extend({ ...toHaveNoViolations });

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock global fetch
global.fetch = vi.fn();

// Mock global URL methods
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock window.matchMedia
interface MediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addListener: (listener: (ev: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (ev: MediaQueryListEvent) => void) => void;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
  dispatchEvent: (event: Event) => boolean;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
  ),
});

// Configure axe timeout
interface AxeConfig {
  timeout: number;
}

declare global {
  interface Window {
    axe: AxeConfig;
  }

  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}

window.axe = {
  timeout: 5000,
};

// Mock environment variables
vi.stubEnv("FIREBASE_API_KEY", "test-api-key");
vi.stubEnv("FIREBASE_AUTH_DOMAIN", "test.firebaseapp.com");
vi.stubEnv("FIREBASE_PROJECT_ID", "test-project");
vi.stubEnv("FIREBASE_STORAGE_BUCKET", "test.appspot.com");
vi.stubEnv("FIREBASE_MESSAGING_SENDER_ID", "123456789");
vi.stubEnv("FIREBASE_APP_ID", "1:123456789:web:abcdef");
vi.stubEnv("FIREBASE_MEASUREMENT_ID", "G-ABCDEF123");
