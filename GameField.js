class GameField extends Game {
  constructor(fieldSize, gamers) {
    super();
    this.fieldSize = fieldSize || 16;
    this.#gamers = gamers;
    this.writeHistory = (...agrs) => super.writeHistory(...agrs);
    this.getField = this.getField.bind(this);
    this.getGamers = this.getGamers.bind(this);
    this.setField = this.setField.bind(this);
    this.setGamers = this.setGamers.bind(this);
  }
  
  #field = [];
  #gamers = [];

  static proxyHandler = {
    construct(Target, args) {
      console.log("Target", Target);
      return new Proxy(new Target(...args), {
        get(Target, prop, receiver) {
          console.log("prop", prop);
          const val = Target[prop];
          if (typeof val === "function") {
            return function (...args) {
              console.log(Gamer.tracedAction.includes(prop));
              if (
                Gamer.tracedAction.includes(prop) &&
                !writeHistory(Target, prop, args)
              )
                return false;
              this.render();
              console.log(1);
              return val.apply(this, args);
            };
          } else {
            return val;
          }
        },
      });
    },
  };

  render() {
    const root = document.getElementById("root");
    console.log("root", root);
    root.innerHTML = "Hello Dolly.";
  }

  get field() {
    const field = JSON.parse(JSON.stringify(this.getField()));
    this.getGamers().forEach((gamer) => {
      field[gamer.x][gamer.y].id = gamer.id;
    });
    return field;
  }

  getGamers() {
    return this.#gamers;
  }

  setGamers(gamers) {
    this.#gamers = gamers;
  }

  getField() {
    return this.#field;
  }

  setField(field) {
    this.#field = field;
  }

  move(id, direction) {
    const gamer = this.getGamer(id);
    switch (direction) {
      case "right":
        gamer.setPosition(
          gamer.x,
          gamer.y + 1,
          this.field[gamer.x][gamer.y + 1]
        );
        break;
      case "left":
        gamer.setPosition(
          gamer.x,
          gamer.y - 1,
          this.field[gamer.x][gamer.y - 1]
        );
        break;
      case "down":
        gamer.setPosition(
          gamer.x + 1,
          gamer.y,
          this.field[gamer.x + 1][gamer.y]
        );
        break;
      case "up":
        gamer.setPosition(
          gamer.x - 1,
          gamer.y,
          this.field[(gamer.x - 1, gamer.y)][gamer.y]
        );
        break;
      default:
        break;
    }
  }

  damage(damagerId, damagedId) {
    const damager = this.getGamer(damagerId);
    const damaged = this.getGamer(damagedId);
    damaged.makeDamage(damager.damage);
  }

  createField() {
    this.setField(
      JSON.parse(
        JSON.stringify(
          new Array(this.fieldSize).fill([
            ...new Array(this.fieldSize).fill({ id: 0 }),
          ])
        )
      )
    );
  }

  createGamers() {
    // const writeHistory = this.writeHistory;
    this.setGamers(
      this.getGamers().map((Gamer, index) => {
        const getRand = () => index;
        // Math.floor(Math.random() * this.fieldSize);
        const gamer = new Gamer(index + 1, getRand(), getRand());
        return gamer;
      })
    );
  }

  getGamer(id) {
    return this.getGamers().find((gamer) => gamer.id === id);
  }

  getVeiwGamer(id) {
    const gamer = this.getGamer(id);
    function filterVeiw(index, position) {
      return (
        index >= position - gamer.parameter.view &&
        index <= position + gamer.parameter.view
      );
    }
    return this.field
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
    this.field.forEach((item, indexX) => {
      item.forEach((item, indexY) => {
        if (item.id === id) {
          x = indexX;
          y = indexY;
        }
      });
    });
    return { x, y };
  }

  prepareToGame() {
    this.createField();
    this.createGamers();
  }
}
