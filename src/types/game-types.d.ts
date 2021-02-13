interface Choice {
  name: string;
  key: string;
  action: Function;
}

type Choices = Choice[];

interface Resources {
  waterInCanteen: number;
}

interface Status {
  miles: number;
  camelTiredness: number;
  thirst: number;
  nativesMiles: number;
}

interface LossConditions {
  camelTiredness: number;
  thirst: number;
}

const enum Controls {
  Go = '1',
  GoFast = '2',
  Drink = '3',
  Rest = '4',
  StatusCheck = '5',
  Quit = 'Q',
}

export { Choice, Choices, Controls, Resources, Status, LossConditions };
