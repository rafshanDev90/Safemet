import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import { Reveal } from './Reveal';

/* PLACEHOLDER DATA — Replace with real client/partner branding.
 * Real logo files: drop one image per client into client/public/images/partners/
 * and update the `src` below (e.g. src="/images/partners/acme.png").
 */
const PARTNER_LOGOS = [
  { id: 'pl-1', name: 'Client 01', src: '/images/partners/client-logo-01.svg' },
  { id: 'pl-2', name: 'Client 02', src: '/images/partners/client-logo-02.svg' },
  { id: 'pl-3', name: 'Client 03', src: '/images/partners/client-logo-03.svg' },
  { id: 'pl-4', name: 'Client 04', src: '/images/partners/client-logo-04.svg' },
  { id: 'pl-5', name: 'Client 05', src: '/images/partners/client-logo-05.svg' },
  { id: 'pl-6', name: 'Client 06', src: '/images/partners/client-logo-06.svg' },
  { id: 'pl-7', name: 'Client 07', src: '/images/partners/client-logo-07.svg' },
  { id: 'pl-8', name: 'Client 08', src: '/images/partners/client-logo-08.svg' },
];

export const PartnersClientsSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="partners-clients" className="w-full bg-[#f4f5f6] dark:bg-[var(--bg-secondary)] py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-12 border-b border-neutral-200 dark:border-[var(--border-default)] gap-2">
            <div className="flex items-center gap-4">
              <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
                {t('partnersClients.title')}
              </h2>
            </div>
            <span className="text-sm text-neutral-500 dark:text-[var(--text-dim)] font-semibold tracking-wider uppercase hidden sm:inline-block">
              {t('partnersClients.subtitle')}
            </span>
          </div>
        </Reveal>

        {/* Placeholder Logo Strip — 2 per row (mobile), 3 (tablet), 5 (desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {PARTNER_LOGOS.map((logo, idx) => (
            <Reveal key={logo.id} delay={idx * 0.05}>
              <div className="bg-white dark:bg-[var(--bg-card)] border border-neutral-200 dark:border-[var(--border-default)] rounded-xs shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-4 sm:p-5 h-full">
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  className="w-full h-auto max-w-[140px] grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Placeholder note — remove once real logos are added */}
        <Reveal delay={0.2}>
          <p className="mt-8 text-[11px] text-neutral-400 dark:text-[var(--text-faint)] tracking-wide uppercase text-center">
            {t('partnersClients.placeholderNote')}
          </p>
        </Reveal>
      </Container>
    </section>
  );
};