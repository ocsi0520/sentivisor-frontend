import { AllowedLanguage } from "#shared/allowed-languages";
import { HarmfulnessEvaluation } from "../../../HarmfulnessEvaluation";

type Translation = {
  TITLE: string;
  EMOTION: string;
  TAKE_CARE: string;
  READ_TEXT: string;
  ADD_TO_BLACKLIST: string;
  SKIP_SITE: string;
};

const getAllModalTranslations = ({
  maxEmotion: vividEmotion,
}: HarmfulnessEvaluation): Record<AllowedLanguage, Translation> => ({
  en: {
    TITLE: "Your mental health matters.",
    // TODO: find a proper way to inject translated parts
    EMOTION: `The detected content reflects a significant level of <strong>${vividEmotion}</strong>.`,
    TAKE_CARE:
      "Take care of yourself and read only if necessary.",
    READ_TEXT: "I need to read this",
    ADD_TO_BLACKLIST:
      "Ignore this domain",
    SKIP_SITE: "Skip the content",
  },
});

export class TemplateStringTranslator {
  private static TRANSLATION_KEY_PREFIX = "TRANSLATION";
  public translateTemplateString(
    templateString: string,
    harmfulnessEvaluation: HarmfulnessEvaluation
  ): string {
    const allTranslations = getAllModalTranslations(harmfulnessEvaluation);
    // TODO: recieve this from storage
    const language: AllowedLanguage = "en";
    const currentTranslations = allTranslations[language] || allTranslations.en;
    const allTranslationEntry = Object.entries(currentTranslations);

    return allTranslationEntry.reduce(
      (partiallyTranslatedHtml, [translationKey, translationvalue]) =>
        partiallyTranslatedHtml.replace(
          this.getTemplateKey(translationKey),
          translationvalue
        ),
      templateString
    );
  }

  private getTemplateKey(translationKey: string): string {
    return `{{${TemplateStringTranslator.TRANSLATION_KEY_PREFIX}_${translationKey}}}`;
  }
}
