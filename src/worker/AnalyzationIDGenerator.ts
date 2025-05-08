import { AnalyzableContent } from "#shared/messages";

export class AnalyzationIDGenerator {
  public generateIDFor(analyzableContent: AnalyzableContent): string {
    return encodeURIComponent(
      `${analyzableContent.language}-${analyzableContent.url}`
    );
  }
}
