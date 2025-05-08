import { AllowedLanguage } from "./allowed-languages";
import { EmotionScores } from "./emotion-scores";

export type ParseEvent = {
  message: undefined;
  // TODO: return EmotionScores or undefined
  response: void;
};

export type DisplayData =
  | { type: "black-listed" }
  | { type: "off-supervision-mode" }
  | { type: "inner-page" }
  | {
      type: "displayable";
      emotionScores: EmotionScores;
      alreadyHandled: boolean;
    };

export type DisplayEvent = {
  message: DisplayData;
  response: void;
};

export type AnalyzableContent = {
  // content --> worker
  text: string;
  language: AllowedLanguage;
  url: string;
};

export type AnalyzeEvent = {
  message: AnalyzableContent; // content --> worker
  response: DisplayData;
};

export type BlackListChangeEvent = {
  message?: undefined;
  response: void;
};

export type GetPrimaryDomainEvent = {
  message?: undefined;
  response: string;
};

export type ConsentChangeEvent = {
  message: boolean;
  response: void;
};

export type MessageMap = {
  parse: ParseEvent; // ??? --> content // then after it parsed, it sends "analyze"
  display: DisplayEvent; // worker, content --> sidepanel
  analyze: AnalyzeEvent; // content --> worker
  blackListChange: BlackListChangeEvent;
  getPrimaryDomain: GetPrimaryDomainEvent;
  consentChange: ConsentChangeEvent;
};
