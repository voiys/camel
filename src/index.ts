import { config } from './config';
import { Game } from './Game';

const main = () => {
  const game = new Game(config);
  game.start();
};

main();
