import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const AboutSeoSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 md:py-24 border-t border-neutral-200 dark:border-[var(--border-default)]">
      <Container className="text-center">
        <Reveal>
          <h3 className="text-base sm:text-lg font-extrabold tracking-wider text-[#1a1d20] dark:text-[var(--text-stronger)] uppercase mb-4 font-['Montserrat',sans-serif]">
            {t('aboutSeo.title')}
          </h3>
          <p className="text-[13px] sm:text-sm text-[#555a60] dark:text-[var(--text-muted)] leading-relaxed max-w-4xl mx-auto font-normal">
            {t('aboutSeo.text')}
          </p>
        </Reveal>
      </Container>
    </section>
  );
};
