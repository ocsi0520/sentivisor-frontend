import { EmotionScores } from "#shared/emotion-scores";
import { AnalyzableContent } from "#shared/messages";

export class Analyzer {
  public async analyze({
    text,
    language,
  }: AnalyzableContent): Promise<EmotionScores> {
    const jsonToSend: string = JSON.stringify({ data: text, language });
    const response = await fetch("https://api.sentivisor.com/v1/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonToSend,
    });
    if (!response.ok) {
      throw new Error("Error at fetching analyzation from server");
    }
    return response.json();
  }
}
