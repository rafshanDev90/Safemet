import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, type SupportedLanguage } from '../i18n';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
}

const OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'EN' },
  { code: 'bn', label: 'বাং' },
];

export const LanguageToggle: React.FC = () => {
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || 'en').split('-')[0] as SupportedLanguage;

  return (
    <div
      role="group"
      aria-label={t('header.languageLabel')}
      className="flex items-center rounded-sm overflow-hidden border border-neutral-700 bg-[#252a2e]"
    >
      {OPTIONS.map((opt) => {
        const active = current === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => changeLanguage(opt.code)}
            aria-pressed={active}
            className={`min-w-[38px] min-h-[38px] px-2.5 flex items-center justify-center text-[13px] font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
              active
                ? 'bg-[#E5252B] text-white'
                : 'bg-transparent text-neutral-300 hover:text-[#E5252B]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};