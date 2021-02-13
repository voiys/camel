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
}

interface LossConditions {
  camelTiredness: number;
  thirst: number;
  milesAhead: number;
}

export { Choice, Choices, Resources, Status, LossConditions };
