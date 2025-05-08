import { EmotionScores } from "#shared/emotion-scores";
import { HarmfulnessEvaluation } from "../HarmfulnessEvaluation";

export interface Consultant {
  evaluate(emotionScores: EmotionScores): Promise<HarmfulnessEvaluation>;
}
