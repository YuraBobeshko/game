const first = new new Proxy(GameField, GameField.proxyHandler)(
  5,
  new Array(2).fill(Gamer)
);

// console.log(first);
first.prepareToGame();
// console.log(first.getVeiwGamer(2))

// first.startGame()
// const gamerFirst = first.getGamer(1);
// console.log(gamerFirst);
// const gamerSecond = first.getGamer(2);
// first.GameField.findPosition(1);
// console.log(first.field);
// // console.log(gamerFirst)
// first.move(1, "right");
// console.log(first.field);
// first.move(1, "down");
// console.log(first.field);
// first.move(2, "right");
// console.log(first.field);
// // console.log(first.history);

// gamerFirst.move("right");
// console.log(first.field);
// console.log(first.history);

// gamerSecond.move("right");
// console.log(first.field);

// console.log(first.getVeiwGamer(2))

// gamerSecond.move("left");
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

document.addEventListener("keydown", function (event) {
  if (event.code == "Space") {
    first.startGame();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowRight") {
    first.move(1, "right");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowLeft") {
    first.move(1, "left");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowUp") {
    first.move(1, "up");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowDown") {
    first.move(1, "down");
  }
});
