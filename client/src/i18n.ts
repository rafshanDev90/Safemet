import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import bn from './locales/bn.json';

export const LANGUAGES = ['en', 'bn'] as const;
export type SupportedLanguage = (typeof LANGUAGES)[number];

const STORAGE_KEY = 'safemete-lang';

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'bn') return stored;
  } catch {
    // ignore storage errors (e.g. private mode)
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...LANGUAGES],
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

function syncHtmlLanguage(lng: string) {
  document.documentElement.setAttribute('lang', lng);
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

syncHtmlLanguage(i18n.resolvedLanguage || 'en');

i18n.on('languageChanged', syncHtmlLanguage);

export function changeLanguage(lng: SupportedLanguage) {
  if (i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }
}

export function isBangla(): boolean {
  return (i18n.resolvedLanguage || 'en').startsWith('bn');
}

export default i18n;