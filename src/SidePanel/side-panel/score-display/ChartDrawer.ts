import { inject, singleton } from "tsyringe";
import { ChartProvider } from "./ChartProvider";
import { EmotionScores } from "#shared/emotion-scores";
import { msg } from "@lit/localize";

@singleton()
export class ChartDrawer {
  constructor(@inject(ChartProvider) private chartProvider: ChartProvider) {}

  public drawSentimentChart(
    canvas: HTMLCanvasElement,
    data: EmotionScores
  ): void {
    const sentimentChart = this.chartProvider.provideChart(canvas);

    const emotions = [
      "joy",
      "fear",
      "surprise",
      "sadness",
      "disgust",
      "anger",
    ] as const;
    const emotionValues = emotions.map((emotion) => data[emotion] || 0);
    const maxValue = Math.max(...emotionValues) || 1;

    const normalizedData = emotionValues.map(
      (value) => (value / maxValue) * 100
    );

    sentimentChart.data.labels = [
      msg("Joy"),
      msg("Fear"),
      msg("Surprise"),
      msg("Sadness"),
      msg("Disgust"),
      msg("Anger"),
    ];
    sentimentChart.data.datasets[0].data = normalizedData;

    sentimentChart.update();
  }
}
