class Game {
  #iteration = 4000;
  #step = 0;

  #history = [{ log: [] }];
  get history() {
    return this.#history;
  }

  startGame() {
    this.#history.push({ step: 0, log: [] });
    console.log(this.#history);

    setInterval(() => {
      this.#step++;
      this.#history.push({ step: this.#step, log: [] });
      console.log(this.#history);
    }, this.#iteration);
  }

  writeHistory(who, action, whom) {
    console.log("action", action);
    const count = this.#history[this.#step].log.filter(
      (item) => item.who.id === who.id && item.action === action
    ).length;
    const limitedCount = who.parameter.limited.find(
      (item) => item.action === action
    )?.count;

    if (!limitedCount || limitedCount > count) {
      this.#history[this.#step].log.push({ who, action, whom });
      return true;
    } else {
      return false;
    }
  }
}
