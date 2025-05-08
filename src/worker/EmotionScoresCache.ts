import { EmotionScores } from "#shared/emotion-scores";
import { AnalyzableContent } from "#shared/messages";
import { AnalyzationIDGenerator } from "./AnalyzationIDGenerator";

type CachePart = {
  emotionScoresCache: {
    [key: string]: EmotionScores;
  };
};

export class EmotionScoresCache {
  constructor(private idGenerator: AnalyzationIDGenerator) {}
  public async getCacheFor(
    analyzableContent: AnalyzableContent
  ): Promise<EmotionScores | undefined> {
    const cachePart = await this.getAllCache();
    const id = this.idGenerator.generateIDFor(analyzableContent);
    return cachePart.emotionScoresCache[id];
  }

  public async setCache(
    analyzableContent: AnalyzableContent,
    evaluation: EmotionScores
  ): Promise<void> {
    const allCache = await this.getAllCache();
    const id = this.idGenerator.generateIDFor(analyzableContent);
    allCache.emotionScoresCache[id] = evaluation;
    await chrome.storage.session.set<CachePart>(allCache);
  }

  private getAllCache(): Promise<CachePart> {
    return chrome.storage.session.get<CachePart>({ emotionScoresCache: {} });
  }
}
