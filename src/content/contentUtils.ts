import { franc } from "franc";

const iso6393to1: Record<string, string> = {
    eng: 'en',
    fra: 'fr',
    deu: 'de',
    spa: 'es',
    ita: 'it',
    hun: 'hu',
};

export function checkLanguage(text: string): string {
    const iso6393Code = franc(text); // franc returns the 3-letter code
    return iso6393to1[iso6393Code] || 'und'; // Default value: 'und' (undefined)
}

export function getPrimaryDomain(): string {
    const url = new URL(window.location.href);
    const primaryDomain = url.hostname.split('.').slice(-2).join('.');
    return primaryDomain;
}
