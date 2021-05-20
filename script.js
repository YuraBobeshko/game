const first = new new Proxy(GameField, GameField.proxyHandler)(
  5,
  new Array(2).fill(Gamer)
);

first.prepareToGame();


