const first = new new Proxy(GameField, GameField.proxyHandler)(
  new Array(2).fill(Gamer)
);

first.prepareToGame(5);
