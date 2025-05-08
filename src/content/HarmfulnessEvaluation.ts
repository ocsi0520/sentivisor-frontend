import { EmotionScores } from "#shared/emotion-scores";

export type HarmfulnessEvaluation = {
  harmfulnessScore: number;
  maxEmotion: keyof EmotionScores;
};
