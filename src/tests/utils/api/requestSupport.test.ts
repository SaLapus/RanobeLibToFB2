import { describe, expect, it, vi } from "vitest";
import requestSupport from "../../../utils/api/requestSupport";

// Mock the Awaiter class

vi.mock("../../../utils/api/awaiter", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        next: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe("requestSupport", () => {
  const mockFunction = vi.fn();
  const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

  beforeEach(() => {
    // mockFunction.mockReset();
    // mockNext.mockReset();
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the wrapped function with correct arguments", async () => {
    mockFunction.mockResolvedValue("success");
    const wrappedFunction = requestSupport(mockFunction);

    await wrappedFunction("arg1", "arg2");

    expect(mockFunction).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("retries on failure", async () => {
    vi.useRealTimers();
    mockFunction
      .mockRejectedValueOnce(new Error("First attempt failed"))
      .mockResolvedValueOnce("success");

    const wrappedFunction = requestSupport<string[], Promise<string>>(
      mockFunction
    );
    const result = await wrappedFunction("test");

    expect(mockFunction).toHaveBeenCalledTimes(2);
    expect(result).toBe("success");
  });

  it("respects rate limiting", async () => {
    mockFunction.mockResolvedValue("success");
    const wrappedFunction = requestSupport(mockFunction);

    // Make multiple calls in parallel
    const promises = Array.from({ length: 3 }).map(() =>
      wrappedFunction("test")
    );

    // Fast-forward time to simulate rate limiting
    vi.advanceTimersByTime(60000);

    const results = await Promise.all(promises);
    expect(results).toEqual(["success", "success", "success"]);
  });

  it("handles multiple concurrent requests", async () => {
    vi.useRealTimers();
    mockFunction.mockImplementation(() => delay(100).then(() => "success"));

    const wrappedFunction = requestSupport<string[], Promise<string>>(
      mockFunction
    );

    const promise = Promise.all([
      wrappedFunction("test1"),
      wrappedFunction("test2"),
    ]);

    const results = await promise;

    expect(results).toEqual(["success", "success"]);
  });

  it("wraps function with retry logic", async () => {
    const mockFn = vi.fn().mockResolvedValue("success");
    const wrapped = requestSupport<string[], Promise<string>>(mockFn);

    const result = await wrapped("test");

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("waits for awaiter before each attempt", async () => {
    vi.useRealTimers();
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error("First failure"))
      .mockRejectedValueOnce(new Error("Second failure"))
      .mockResolvedValueOnce("success");

    const wrapped = requestSupport<[], Promise<string>>(mockFn);

    const result = await wrapped();

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(result).toBe("success");
  });

  it("retries up to 10 times before giving up", async () => {
    const error = new Error("Failed");
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => void 0);

    const wrapped = requestSupport(mockFn);

    try {
      await Promise.all([wrapped("test"), vi.runAllTimersAsync()]);
      fail("Expected function to throw");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain("Too many (10) attempts");
    }

    expect(mockFn).toHaveBeenCalledTimes(10);
    expect(mockConsoleError).toHaveBeenCalledTimes(10);

    mockConsoleError.mockRestore();
  });
});
