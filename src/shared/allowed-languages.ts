export const allAllowedLanguages = ["en"] as const;
export type AllowedLanguage = (typeof allAllowedLanguages)[number];

export const isAllowedLanguage = (
  language: string
): language is AllowedLanguage =>
  allAllowedLanguages.includes(language as AllowedLanguage);
