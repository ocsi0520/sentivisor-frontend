import { AllowedLanguage } from "#shared/allowed-languages";
import { DisplayableData, ErrorDisplayData } from "./display";

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
