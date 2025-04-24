interface AwaiterOptions {
  cap?: number;
  timeoutMs?: number;
}

export default class Awaiter {
  private cap: number;
  private timeoutMs: number;
  private _current = 0;
  private queue: (() => void)[] = [];

  private set current(cur: number) {
    if (cur < this._current && this.queue.length > 0) this.queue.shift()?.();
    this._current = cur;
  }

  private get current() {
    return this._current;
  }

  constructor(options: AwaiterOptions = {}) {
    this.cap = options.cap ?? 50;
    this.timeoutMs = options.timeoutMs ?? 60_000;
  }

  async next() {
    if (this.current >= this.cap)
      await new Promise<void>((res) => this.queue.push(res));

    this.current += 1;
    setTimeout(() => {
      this.current -= 1;
    }, this.timeoutMs);
  }
}
