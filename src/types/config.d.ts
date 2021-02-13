interface EndMessage {
  success: string;
  failure: string;
}

interface Config {
  introMessage: string;
  endMessage: EndMessage;
}

export { Config };
