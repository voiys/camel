import { closeTerminalPrompt, terminalPrompt } from './helpers';
import {
  Choices,
  Config,
  DisplayChoicesSignature,
  DisplayIntroMessageSignature,
  PrintMessageSignature,
  PromptSignature,
  FinishSignature,
  DisplayEndMessageSignature,
  StartSignature,
  CheckStatusSignature,
  Resources,
  Status,
  LossConditions,
  GameLoopSignature,
  GoSignature,
  DrinkSignature,
  StopAndRestSignature,
  MoveNativesSignature,
  MoveSignature,
  IncreaseThirstSignature,
} from './types';

class Game {
  private config: Config;
  private choices: Choices;
  private gameOver: boolean;
  private win: boolean;
  private status: Status;
  private resources: Resources;
  private maxWaterInCanteen: number;
  private lossConditions: LossConditions;
  private nativesSpeed: number;
  private milesToGoal: number;
  private nativesMiles: number;
  private playerSpeed: number;

  constructor(config: Config) {
    this.config = config;

    this.milesToGoal = 200;
    this.maxWaterInCanteen = 5;
    this.nativesSpeed = 5;
    this.playerSpeed = 7;
    this.lossConditions = {
      camelTiredness: 7,
      thirst: 5,
      milesAhead: 0,
    };

    this.gameOver = false;
    this.win = false;
    this.nativesMiles = 0;
    this.status = {
      camelTiredness: 0,
      miles: 20,
      thirst: 0,
    };
    this.resources = {
      waterInCanteen: this.maxWaterInCanteen,
    };

    this.choices = [
      { name: 'Ahead moderate speed', key: '1', action: this.go },
      { name: 'Ahead full speed', key: '2', action: this.goFast },
      { name: 'Drink from your canteen', key: '3', action: this.drink },
      { name: 'Stop and rest', key: '4', action: this.stopAndRest },
      {
        name: 'Status check',
        key: '5',
        action: this.checkStatus,
      },
      {
        name: 'Quit',
        key: 'Q',
        action: () => this.finish(true),
      },
    ];
  }

  move: MoveSignature = args => {
    const minimum = args.natives ? this.nativesSpeed : this.playerSpeed;
    const fast = args.fast;

    return Math.round(Math.random() * minimum + (fast ? 3 : 0)) + minimum;
  };

  increaseThirst: IncreaseThirstSignature = () => {
    return Math.random() > 0.5 ? 2 : 1;
  };

  go: GoSignature = fast => {
    this.status = {
      miles: this.status.miles + this.move({ natives: false, fast }),
      camelTiredness: this.status.camelTiredness + (fast ? 2 : 1),
      thirst: this.increaseThirst(),
    };
  };

  drink: DrinkSignature = () => {
    this.status = {
      ...this.status,
      thirst: 0,
    };

    this.resources = {
      waterInCanteen: this.resources.waterInCanteen - 1,
    };
  };

  stopAndRest: StopAndRestSignature = () => {
    this.status = {
      ...this.status,
      camelTiredness: 0,
      thirst: this.increaseThirst(),
    };
  };

  moveNatives: MoveNativesSignature = () => {
    this.nativesMiles += this.move({ fast: false, natives: true });
  };

  printMessage: PrintMessageSignature = msg => {
    console.log(msg);
  };

  displayIntroMessage: DisplayIntroMessageSignature = () => {
    this.printMessage(this.config.introMessage);
  };

  displayEndMessage: DisplayEndMessageSignature = () => {
    const msg = this.win
      ? this.config.endMessage.success
      : this.config.endMessage.failure;
    this.printMessage(msg);
  };

  displayChoices: DisplayChoicesSignature = () => {
    this.choices.forEach(choice => {
      const msg = `${choice.key}: ${choice.name}`;
      this.printMessage(msg);
    });
  };

  checkStatus: CheckStatusSignature = () => {
    const messages = [
      `Water in canteen: ${this.resources.waterInCanteen} / ${this.maxWaterInCanteen}`,
      `Camel tiredness: ${this.status.camelTiredness} / ${this.lossConditions.camelTiredness}`,
      `Thirst: ${this.status.thirst} / ${this.lossConditions.thirst}`,
      `Miles ahead of natives: ${this.status.miles - this.nativesMiles}`,
      `Miles to go: ${this.milesToGoal - this.status.miles}`,
    ];

    messages.forEach(message => this.printMessage(message));
  };

  prompt: PromptSignature = async () => {
    let msg = 'Your choice? ';
    let answer: string;
    do {
      answer = await terminalPrompt(msg);
      if (answer.length !== 1) {
        msg = `Your answer should be 1 character long, please try again. `;
      }
    } while (answer.length !== 1);
    return answer;
  };

  finish: FinishSignature = exit => {
    if (exit) {
      this.printMessage('Bye!');
      closeTerminalPrompt();
      process.exit();
    } else {
      this.gameOver = true;
    }
  };

  gameLoop: GameLoopSignature = () => {
    do {
      this.displayChoices();
      this.prompt().then(answer => {
        this.choices
          .find(choice => choice.key === answer.toUpperCase())!
          .action();
      });
      if (!this.gameOver) this.moveNatives();
    } while (!this.gameOver);
  };

  start: StartSignature = () => {
    this.displayIntroMessage();
    this.gameLoop();
    this.displayEndMessage();
  };
}

export { Game };