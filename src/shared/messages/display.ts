import { EmotionScores } from "#shared/emotion-scores";

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
