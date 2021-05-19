class Game {
  #iteration = 4000;
  #step = 0;

  #historical = [];
  get() {
    return this.#historical;
  }
  startGame() {
    this.#historical.push({ step: 0, log: [] });
    console.log(this.#historical);

    setInterval(() => {
      this.#step++;
      this.#historical.push({ step: this.#step, log: [] });
      console.log(this.#historical);
    }, this.#iteration);
  }

  writeHistory(who, action, whom) {
    this.#historical[this.#step].log.push({ who, action, whom });
  }
}

class GameField extends Game {
  constructor(fieldSize, gamers) {
    super();
    this.#fieldSize = fieldSize;
    this.#gamers = gamers;
  }

  #fieldSize = 16;
  #field = [];
  #gamers = [];

  get field() {
    return this.#field;
  }

  createField() {
    this.#field = JSON.parse(
      JSON.stringify(
        new Array(this.fieldSize).fill([
          ...new Array(this.fieldSize).fill({ id: 0 }),
        ])
      )
    );
  }

  createGamers() {
    this.#gamers = this.#gamers.map((Gamer, index) => {
      const getRand = () => index;
      // Math.floor(Math.random() * this.fieldSize);

      const calcHandler = {
        construct(Target, args) {
          return new Proxy(new Target(...args), {
            get(Target, prop, receiver) {
              const val = Target[prop];
              if (typeof Target[prop] === "function") {
                return function (...args) {
                  console.log(super.writeHistory);
                  super.writeHistory(Target, prop, {});
                  console.log(prop + "() called");
                  return val.apply(Target, args);
                };
              } else {
                return val;
              }
            },
          });
        },
      };

      const GamerProxy = new Proxy(Gamer, calcHandler);

      const gamer = new GamerProxy(
        index + 1,
        getRand(),
        getRand(),
        this.changePosition.bind(this)
      );

      this.#field[gamer.x][gamer.y].id = gamer.id;
      return gamer;
    });
  }

  getGamer(id) {
    return this.#gamers.find((gamer) => gamer.id === id);
  }

  getVeiwGamer(id) {
    const gamer = this.getGamer(id);
    function filterVeiw(index, position) {
      return (
        index >= position - gamer.parameter.view &&
        index <= position + gamer.parameter.view
      );
    }
    return this.#field
      .map((item, indexX) => {
        if (filterVeiw(indexX, gamer.x)) {
          return item.filter((item, indexY) =>
            filterVeiw(indexY, gamer.y) ? item : false
          );
        } else {
          return false;
        }
      })
      .filter(Boolean);
  }

  findPosition(id) {
    let x, y;
    this.#field.forEach((item, indexX) => {
      item.forEach((item, indexY) => {
        if (item.id === id) {
          x = indexX;
          y = indexY;
        }
      });
    });
    return { x, y };
  }

  changePosition(x, y, id) {
    if (x < 0 || y < 0) return false;
    const oldId = this.#field[x][y].id;
    this.#field[x][y] = { id };
    return { x, y, oldId };
  }

  prepareToGame() {
    this.createField();
    this.createGamers();
  }
}

class Gamer {
  constructor(id, x, y, changePosition, parameter = { view: 1 }) {
    this.#id = id;
    this.#x = x;
    this.#y = y;
    this.changePosition = function (x, y) {
      const value = changePosition(x, y, this.id);
      if (value) {
        changePosition(this.x, this.y, value.oldId);
        this.x = value.x;
        this.y = value.y;
      }
    };
    this.#parameter = parameter;
  }

  #id;
  #x;
  #y;
  #parameter;

  get id() {
    return this.#id;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
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

  move(direction) {
    switch (direction) {
      case "right":
        this.changePosition(this.x, this.y + 1);
        break;

      case "left":
        this.changePosition(this.x, this.y - 1);
        break;

      case "down":
        this.changePosition(this.x + 1, this.y);
        break;

      case "up":
        this.changePosition(this.x - 1, this.y);
        break;

      default:
        break;
    }
  }
}

const first = new GameField(5, new Array(2).fill(Gamer));
first.prepareToGame();
// console.log(first.getVeiwGamer(2))

// first.startGame()
const gamerFirst = first.getGamer(1);

// const gamerSecond = first.getGamer(2);
// first.GameField.findPosition(1);
// console.log(first.field);
// console.log(gamerFirst)
gamerFirst.move("right");
console.log(first.field);
// gamerFirst.move("right");
// console.log(first.field);
// gamerSecond.move( "right");
// console.log(first.field);

// console.log(first.getVeiwGamer(2))

// gamerSecond.move( "left");
// console.log(first.field);

// console.log(first.getVeiwGamer(2))

// gamerSecond.move( "left");
// console.log(first.field);

// gamerSecond.move( "left");
// console.log(first.field);

// gamerSecond.move( "up");
// console.log(first.field);

// gamerSecond.move( "up");
// console.log(first.field);
