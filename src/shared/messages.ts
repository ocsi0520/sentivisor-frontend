import { AllowedLanguage } from "./allowed-languages";
import { EmotionScores } from "./emotion-scores";

export type TabInfo = { tabId: number; windowId: number };

export type ErrorDisplayData = { type: "error"; errorMessage: string };

export type LoadingDisplayData = { type: "loading" };

export type ExceptionDisplayData =
  | { type: "black-listed" }
  | { type: "off-supervision-mode" }
  | { type: "inner-page" }
  | { type: "unsupported-language" }
  | ErrorDisplayData;

export type DisplayableData = {
  type: "displayable";
  emotionScores: EmotionScores;
};

export type DisplayData =
  | LoadingDisplayData
  | ExceptionDisplayData
  | DisplayableData;

export type AnalyzableContent = {
  // content --> worker
  text: string;
  language: AllowedLanguage;
  url: string;
};

export type AnalyzeEvent = {
  message: AnalyzableContent; // content --> worker
  response: DisplayableData | ErrorDisplayData;
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

export type GetEvaluationEvent = {
  message: TabInfo;
  response: void;
};

export type SendEvaluationEvent = {
  message: { displayData: DisplayData } & TabInfo;
  response: void;
};

export type TabActivatedEvent = {
  message?: never;
  response: void;
};

export type GetTabInfoEvent = {
  message?: never;
  response: TabInfo;
};

// TODO: remove DebugEvent
export type DebugEvent = {
  message: string;
  response?: string;
};

export type MessageMap = {
  act: TabActivatedEvent;
  getTabInfo: GetTabInfoEvent;
  getEvaluation: GetEvaluationEvent;
  sendEvaluation: SendEvaluationEvent;
  analyze: AnalyzeEvent; // content --> worker
  blackListChange: BlackListChangeEvent;
  getPrimaryDomain: GetPrimaryDomainEvent;
  consentChange: ConsentChangeEvent;
  debug: DebugEvent;
};
