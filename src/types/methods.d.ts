type NoArguments<T = any> = () => T;

type PrintMessageSignature = (msg: string) => any;
type DisplayIntroMessageSignature = NoArguments;
type DisplayChoicesSignature = NoArguments;
type PromptSignature = NoArguments<Promise<string>>;
type FinishSignature = (exit?: boolean) => any;
type DisplayEndMessageSignature = NoArguments;
type StartSignature = NoArguments;
type CheckStatusSignature = NoArguments;
type GameLoopSignature = NoArguments;
type GoSignature = (fast: boolean) => any;
type DrinkSignature = NoArguments;
type StopAndRestSignature = NoArguments;
type MoveNativesSignature = NoArguments;
type MoveSignature = (args: { fast: boolean; natives: boolean }) => number;
type IncreaseThirstSignature = NoArguments<number>;

export {
  PrintMessageSignature,
  DisplayChoicesSignature,
  DisplayIntroMessageSignature,
  DisplayEndMessageSignature,
  PromptSignature,
  StartSignature,
  FinishSignature,
  CheckStatusSignature,
  GameLoopSignature,
  GoSignature,
  DrinkSignature,
  StopAndRestSignature,
  MoveNativesSignature,
  MoveSignature,
  IncreaseThirstSignature,
};
