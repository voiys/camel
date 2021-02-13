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
  Controls,
  ExitSignature,
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
    };

    this.gameOver = false;
    this.win = false;
    this.status = {
      nativesMiles: 0,
      camelTiredness: 0,
      miles: 20,
      thirst: 0,
    };
    this.resources = {
      waterInCanteen: this.maxWaterInCanteen,
    };

    this.choices = [
      { name: 'Ahead moderate speed', key: Controls.Go, action: this.go },
      {
        name: 'Ahead full speed',
        key: Controls.GoFast,
        action: () => this.go(true),
      },
      {
        name: 'Drink from your canteen',
        key: Controls.Drink,
        action: this.drink,
      },
      { name: 'Stop and rest', key: Controls.Rest, action: this.stopAndRest },
      {
        name: 'Status check',
        key: Controls.StatusCheck,
        action: this.checkStatus,
      },
      {
        name: 'Quit',
        key: Controls.Quit,
        action: this.exit,
      },
    ];
  }

  move: MoveSignature = args => {
    const minimum = args.natives ? this.nativesSpeed : this.playerSpeed;
    const fast = args.fast;

    return Math.round(Math.random() * minimum + (fast ? 3 : 0)) + minimum;
  };

  increaseThirst: IncreaseThirstSignature = () => {
    return Math.floor(Math.random() * 2) + 1;
  };

  go: GoSignature = fast => {
    const milesMoved = this.status.miles + this.move({ natives: false, fast });
    const thirstIncreased = this.increaseThirst();
    const camelTirednessIncreased = this.status.camelTiredness + (fast ? 2 : 1);

    this.status.miles += milesMoved;
    this.status.camelTiredness += camelTirednessIncreased;
    this.status.thirst += thirstIncreased;

    this.printMessage(`You moved ${milesMoved}.`);
  };

  drink: DrinkSignature = () => {
    if (this.resources.waterInCanteen > 0) {
      this.status.thirst = 0;

      this.resources.waterInCanteen -= 1;

      this.printMessage('You take a sip from your trusty canteen.');
    } else {
      this.printMessage('You have no water left in your canteen.');
    }
  };

  stopAndRest: StopAndRestSignature = () => {
    const restedBy = Math.floor(Math.random() * 3) + 1;

    this.status.camelTiredness -= restedBy;

    this.printMessage(`You rested.`);
  };

  moveNatives: MoveNativesSignature = () => {
    const milesMoved = this.move({ fast: false, natives: true });

    this.status.nativesMiles += milesMoved;

    this.printMessage(`The natives moved ${milesMoved}.`);
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
      `Miles ahead of natives: ${this.status.miles - this.status.nativesMiles}`,
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

  exit: ExitSignature = () => {
    this.printMessage('Bye!');
    closeTerminalPrompt();
    process.exit();
  };

  finish: FinishSignature = win => {
    this.gameOver = true;
    this.win = win;
  };

  gameLoop: GameLoopSignature = async () => {
    let answer: string;
    do {
      this.displayChoices();
      answer = await this.prompt();
      this.choices
        .find(choice => choice.key === answer.toUpperCase())!
        .action();
      const camelIsTooTired =
        this.status.camelTiredness >= this.lossConditions.camelTiredness;
      const playerIsTooThirsty =
        this.status.thirst >= this.lossConditions.thirst;
      const nativesCaughtUp = this.status.miles <= this.status.nativesMiles;
      if (camelIsTooTired || playerIsTooThirsty || nativesCaughtUp) {
        this.finish(false);
      } else if (answer !== Controls.StatusCheck) {
        this.moveNatives();
      }
    } while (!this.gameOver);
  };

  start: StartSignature = () => {
    this.displayIntroMessage();
    this.gameLoop();
    this.displayEndMessage();
  };
}

export { Game };
