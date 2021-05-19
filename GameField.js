class GameField extends Game {
  constructor(fieldSize, gamers) {
    super();
    this.fieldSize = fieldSize || 16;
    this.#gamers = gamers;
    this.writeHistory = (...agrs) => super.writeHistory(...agrs);
    this.prepareToGame = this.prepareToGame.bind(this);
  }

  #field = [];
  #gamers = [];

  get field() {
    const field = JSON.parse(JSON.stringify(this.#field));
    this.gamers.forEach((gamer) => {
      field[gamer.x][gamer.y].id = gamer.id;
    });
    return field;
  }

  get gamers() {
    return this.#gamers;
  }

  set field(field) {
    this.#field = field;
  }

  set gamers(gamers) {
    this.#gamers = gamers;
  }

  static proxyHandler = {
    construct(Target, args) {
      return new Proxy(Reflect.construct(Target, args), {
        get(Target, prop, receiver) {
          const val = Target[prop];
          if (typeof val === "function") {
            return function (...args) {
              if (
                Gamer.tracedAction.includes(prop) &&
                !this.writeHistory(this.getGamer(args[0]), prop, args)
              )
                return false;
              if (Gamer.tracedAction.includes(prop))
                setTimeout(() => {
                  this.render();
                }, 1);
              return val.apply(Target, args);
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
    root.style.width = "325px";
    root.innerHTML = JSON.stringify(this.field).slice(1, -1);
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
    this.field = JSON.parse(
      JSON.stringify(
        new Array(this.fieldSize).fill([
          ...new Array(this.fieldSize).fill({ id: 0 }),
        ])
      )
    );
  }

  createGamers() {
    this.gamers = this.gamers.map((Gamer, index) => {
      const getRand = () => index;
      // Math.floor(Math.random() * this.fieldSize);
      return new Gamer(index + 1, getRand(), getRand());
    });
  }

  getGamer(id) {
    return this.gamers.find((gamer) => gamer.id === id);
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
