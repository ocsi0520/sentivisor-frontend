import { AnalyzeEvent } from "./analyze";
import { GetEvaluationEvent, SendEvaluationEvent } from "./evaluation";
import { TabActivatedEvent, GetTabInfoEvent } from "./tab";

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
