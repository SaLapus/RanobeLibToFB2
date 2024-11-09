class Awaiter {
  cap = 50;
  _current = 0;
  _queue = [];

  /**
   * @param {Number} cur
   */
  set current(cur) {
    if (cur < this._current) if(this._queue.length) this._queue.shift()();
    this._current = cur;
  }

  get current() {
    return this._current;
  }

  constructor({ cap }) {
    this.cap = cap;
  }

  async next() {
    if (this.current >= this.cap) await new Promise((res) => this._queue.push(res));

    this.current += 1;
    setTimeout(() => {
      this.current -= 1;
    }, 60_000);
  }
}

module.exports = Awaiter;
