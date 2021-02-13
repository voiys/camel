import { config } from './constants';
import { Game } from './Game';

const main = () => {
  const game = new Game(config);
  game.start();
};

main();
