import { configureLocalization, LocaleModule } from "@lit/localize";
import { sourceLocale, targetLocales } from "./generated/config";
import { NonDefaultLocaleIdentifier } from "./locale-type";

// TODO: __QUESTION__ should we prelod locales?

const preloadedLocales = targetLocales.reduce(
  (acc, locale) => ({
    ...acc,
    [locale]: import(`./generated/locales/${locale}.ts`),
  }),
  {}
) as Record<NonDefaultLocaleIdentifier, LocaleModule>;

// TODO: make localization.setLocale even more type-safe with "LocaleIdentifier" type

// if the locale is the sourceLocale, then the loadLocale is not going to be executed
// instead the default one is loaded without it (I guess it's somehow cached)
export const localization = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async (locale) =>
    preloadedLocales[locale as NonDefaultLocaleIdentifier],
});
