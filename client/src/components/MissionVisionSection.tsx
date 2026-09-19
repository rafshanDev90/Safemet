import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Quote } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const MissionVisionSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="mission-vision" className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="flex items-center gap-4 pb-8 mb-12 border-b border-neutral-200 dark:border-[var(--border-default)]">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
              {t('missionVision.title')}
            </h2>
          </div>
        </Reveal>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-20">
          {/* Mission Card */}
          <Reveal>
            <div className="bg-[#f4f5f6] dark:bg-[var(--bg-secondary)] border-l-4 border-[#E5252B] p-8 sm:p-10 h-full transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#fde8e9] dark:bg-[var(--bg-badge)] border border-[#f8b4b7] dark:border-[var(--bg-badge-border)] flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#E5252B]" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[#1e2327] dark:text-[var(--text-title)] font-['Montserrat',sans-serif]">
                  {t('missionVision.missionTitle')}
                </h3>
              </div>
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                {t('missionVision.missionText')}
              </p>
            </div>
          </Reveal>

          {/* Vision Card */}
          <Reveal delay={0.1}>
            <div className="bg-[#f4f5f6] dark:bg-[var(--bg-secondary)] border-l-4 border-[#E5252B] p-8 sm:p-10 h-full transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#fde8e9] dark:bg-[var(--bg-badge)] border border-[#f8b4b7] dark:border-[var(--bg-badge-border)] flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#E5252B]" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[#1e2327] dark:text-[var(--text-title)] font-['Montserrat',sans-serif]">
                  {t('missionVision.visionTitle')}
                </h3>
              </div>
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                {t('missionVision.visionText')}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Message from the Chairman — Image on Left */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center mb-16 lg:mb-20">
          {/* Headshot */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="w-60 h-60 sm:w-72 sm:h-72 bg-white dark:bg-[var(--bg-card)] p-2 shadow-md border border-neutral-200 dark:border-[var(--border-default)] overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/chairman.jpg"
                alt={t('missionVision.chairmanAlt')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-5 h-5 text-[#E5252B]" />
              <span className="text-[13px] font-bold tracking-[0.25em] text-[#E5252B] uppercase font-['Montserrat',sans-serif]">
                {t('missionVision.chairmanLabel')}
              </span>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-700 dark:text-[var(--text-muted)] leading-relaxed mb-5">
              {t('missionVision.chairmanText')}
            </p>
            <div className="pt-4 border-t border-neutral-200 dark:border-[var(--border-default)]">
              <p className="text-base font-extrabold text-[#1e2327] dark:text-[var(--text-title)] uppercase tracking-wider font-['Montserrat',sans-serif]">
                {t('missionVision.chairmanName')}
              </p>
              <p className="text-[13px] font-semibold text-neutral-500 dark:text-[var(--text-dim)] uppercase tracking-wider mt-1">
                {t('missionVision.chairmanRole')}
              </p>
            </div>
          </div>
        </div>
        </Reveal>

        {/* Message from the CEO — Image on Right */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Headshot */}
          <div className="md:col-span-4 md:order-last flex justify-center md:justify-end">
            <div className="w-60 h-60 sm:w-72 sm:h-72 bg-white dark:bg-[var(--bg-card)] p-2 shadow-md border border-neutral-200 dark:border-[var(--border-default)] overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/ceo.jpg"
                alt={t('missionVision.ceoAlt')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-8 md:order-first">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-5 h-5 text-[#E5252B]" />
              <span className="text-[13px] font-bold tracking-[0.25em] text-[#E5252B] uppercase font-['Montserrat',sans-serif]">
                {t('missionVision.ceoLabel')}
              </span>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-700 dark:text-[var(--text-muted)] leading-relaxed mb-5">
              {t('missionVision.ceoText')}
            </p>
            <div className="pt-4 border-t border-neutral-200 dark:border-[var(--border-default)]">
              <p className="text-base font-extrabold text-[#1e2327] dark:text-[var(--text-title)] uppercase tracking-wider font-['Montserrat',sans-serif]">
                {t('missionVision.ceoName')}
              </p>
              <p className="text-[13px] font-semibold text-neutral-500 dark:text-[var(--text-dim)] uppercase tracking-wider mt-1">
                {t('missionVision.ceoRole')}
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
};