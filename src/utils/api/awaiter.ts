export default class Awaiter {
  private cap: number = 50;
  private _current = 0;
  private queue: Array<() => void> = [];

  private set current(cur: number) {
    if (cur < this._current && this.queue.length > 0) this.queue.shift()?.();
    this._current = cur;
  }

  private get current() {
    return this._current;
  }

  constructor({ cap }: AwaiterOptions = {cap: 50}) {
    this.cap = cap;
  }

  async next() {
    if (this.current >= this.cap) await new Promise((res) => this.queue.push(res as () => void));

    this.current += 1;
    setTimeout(() => {
      this.current -= 1;
    }, 60_000);
  }
}

interface AwaiterOptions {
  cap: number;
}
