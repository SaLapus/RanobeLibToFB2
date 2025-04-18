import { beforeEach, describe, expect, it, vi } from "vitest";
import Awaiter from "../../../utils/api/awaiter";

describe("Awaiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with correct cap value", () => {
    const awaiter = new Awaiter({ cap: 10 });
    expect(awaiter["cap"]).toBe(10);
  });

  it("allows requests when under cap", async () => {
    const awaiter = new Awaiter({ cap: 2 });

    await awaiter.next();
    await awaiter.next();

    expect(awaiter["current"]).toBe(2);
  });

  it("queues requests when at cap", async () => {
    const awaiter = new Awaiter({ cap: 1 });

    const firstPromise = awaiter.next();
    const secondPromise = awaiter.next();

    await firstPromise;
    vi.advanceTimersByTime(60000); // Advance time to decrease counter

    await secondPromise;
    expect(awaiter["current"]).toBe(1);
  });

  it("decreases counter after timeout", async () => {
    const awaiter = new Awaiter({ cap: 1 });

    await awaiter.next();
    expect(awaiter["current"]).toBe(1);

    vi.advanceTimersByTime(60000);
    expect(awaiter["current"]).toBe(0);
  });

  it("processes queue when counter decreases", async () => {
    const awaiter = new Awaiter({ cap: 1 });

    await awaiter.next();
    const queuedPromise = awaiter.next();

    vi.advanceTimersByTime(60000);
    await queuedPromise;

    expect(awaiter["current"]).toBe(1);
  });

  it("handles multiple queued requests", async () => {
    const awaiter = new Awaiter({ cap: 1 });
    const results: number[] = [];

    // Queue up multiple requests
    await awaiter.next();
    const promise1 = awaiter.next().then(() => results.push(1));
    const promise2 = awaiter.next().then(() => results.push(2));

    vi.advanceTimersByTime(60000);
    await Promise.all([promise1, promise2]);

    expect(results).toEqual([1, 2]);
  });

  it("uses default cap value when not provided", () => {
    const awaiter = new Awaiter();
    expect(awaiter["cap"]).toBe(50);
  });
});
