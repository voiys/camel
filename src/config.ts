import { Config } from './types';

const introMessage = `Welcome to Camel!
You have stolen a camel to make your way across the great Mobi desert.
The natives want their camel back and are chasing you down!
Survive your desert trek and outrun the natives.`;

const endMessageSuccess = 'You made it across the desert! You won!';
const endMessageFailure =
  'Unfortunately, the natives have caught you! You lose!';

const config: Config = {
  introMessage,
  endMessage: {
    success: endMessageSuccess,
    failure: endMessageFailure,
  },
};

export { config };
