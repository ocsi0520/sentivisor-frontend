import { DisplayData } from "./display";
import { TabInfo } from "./tab";

export type GetEvaluationEvent = {
  message: TabInfo;
  response: void;
};

export type SendEvaluationEvent = {
  message: { displayData: DisplayData } & TabInfo;
  response: void;
};
