import { EmotionScores } from "#shared/emotion-scores";
import { HarmfulnessEvaluation } from "../HarmfulnessEvaluation";
import { Consultant } from "./Consultant";

type EmotionWeights = EmotionScores;

const weights: EmotionWeights = {
  joy: -1,
  fear: 1.5,
  surprise: 0.8,
  sadness: 1.2,
  disgust: 1.2,
  anger: 1.5,
};

export class DefaultConsultant implements Consultant {
  public async evaluate(
    emotions: EmotionScores
  ): Promise<HarmfulnessEvaluation> {
    return {
      harmfulnessScore: this.getHarmfulnessScore(emotions),
      maxEmotion: this.getEmotionWithMaxValue(emotions),
    };
  }

  private getHarmfulnessScore(emotions: EmotionScores): number {
    let totalScore = 0;
    let totalEmotionValue = 0;

    for (const [emotion, value] of Object.entries(emotions)) {
      const weight =
        weights[emotion as keyof EmotionScores] !== undefined
          ? weights[emotion as keyof EmotionScores]
          : 0;
      totalScore += value * weight;
      totalEmotionValue += value;
    }

    if (totalEmotionValue === 0) {
      return 0;
    }

    const normalizedScore = totalScore / totalEmotionValue;
    // TODO: check this min-max
    const harmfulnessScore = Math.min(Math.max(normalizedScore, 0), 1);
    return harmfulnessScore;
  }

  private getEmotionWithMaxValue(data: EmotionScores): keyof EmotionScores {
    let maxKey = "";
    let maxValue = -Infinity;

    for (const [key, value] of Object.entries(data)) {
      if (value > maxValue) {
        maxKey = key;
        maxValue = value;
      }
    }

    return maxKey as keyof EmotionScores;
  }
}
