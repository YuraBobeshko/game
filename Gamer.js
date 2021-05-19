class Gamer {
  constructor(
    id,
    x,
    y,
    parameter = {
      view: 1,
      limited: [
        { action: "move", count: 1 },
        { action: "damage", count: 1 },
      ],
    }
  ) {
    this.#id = id;
    this.#x = x;
    this.#y = y;
    this.#parameter = parameter;
    this.#health = 10;
    this.#damage = 2;
  }

  #id;
  #x;
  #y;
  #parameter;
  #health;
  #damage;

  get id() {
    return this.#id;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get health() {
    return this.#health;
  }

  get damage() {
    return this.#damage;
  }

  get parameter() {
    return this.#parameter;
  }

  set x(x) {
    this.#x = x;
  }

  set y(y) {
    this.#y = y;
  }

  static tracedAction = ["move", "damage"];

  canMove(place) {
    return place?.id === 0;
  }

  makeDamage(damage) {
    this.#health = this.#health - damage;
  }

  setPosition(x, y, place) {
    if (!this.canMove(place)) {
      return false;
    } else {
      this.#x = x;
      this.#y = y;
      return true;
    }
  }
}
