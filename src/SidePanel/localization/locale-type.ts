import { targetLocales, allLocales } from './generated/config';
export type NonDefaultLocaleIdentifier = (typeof targetLocales)[number];
export type LocaleIdentifier = (typeof allLocales)[number];
export { allLocales };
