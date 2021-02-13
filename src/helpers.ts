import { createInterface } from 'readline';
import { TerminalPromptSignature } from './types';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const terminalPrompt: TerminalPromptSignature = question =>
  new Promise(res => {
    rl.question(question, answer => {
      res(answer);
    });
  });

const closeTerminalPrompt = () => {
  rl.close();
};

export { terminalPrompt, closeTerminalPrompt };
