import React from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICES, ASSETS } from '../data';
import { Compass, Wrench, ShieldCheck, Cog } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'drafting':
        return <Compass className="w-6 h-6 text-[#E5252B]" />;
      case 'installation':
        return <Wrench className="w-6 h-6 text-[#E5252B]" />;
      case 'testing':
        return <ShieldCheck className="w-6 h-6 text-[#E5252B]" />;
      case 'maintenance':
        return <Cog className="w-6 h-6 text-[#E5252B]" />;
      default:
        return <Wrench className="w-6 h-6 text-[#E5252B]" />;
    }
  };

  return (
    <section id="services" className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="flex items-center gap-4 pb-8 mb-12 border-b border-neutral-200 dark:border-[var(--border-default)]">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
              {t('services.title')}
            </h2>
          </div>
        </Reveal>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Intro Quote + Inspection Photo */}
          <Reveal className="lg:col-span-5 flex flex-col space-y-6">
            {/* Red Quote Block */}
            <div className="flex items-start gap-3">
              <span className="text-5xl sm:text-6xl font-serif text-[#E5252B] leading-none font-bold select-none">
                “
              </span>
              <p className="text-sm sm:text-[15px] font-medium text-neutral-700 dark:text-[var(--text-muted)] leading-relaxed pt-1">
                {t('services.introQuote')}
              </p>
            </div>

            {/* Inspection Engineer Photo */}
            <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden shadow-md border border-neutral-200 dark:border-[var(--border-default)] group hover:shadow-xl transition-shadow duration-300">
              <img
                src={ASSETS.inspection}
                alt={t('services.imageAlt')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[12px] uppercase font-bold tracking-widest bg-[#E5252B] px-2.5 py-0.5 rounded-xs">
                  {t('services.badge')}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: 2x2 Services Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
            {SERVICES.map((srv, idx) => (
              <Reveal key={srv.id} delay={idx * 0.08}>
                <div
                  id={`service-card-${srv.id}`}
                  className="flex flex-col space-y-4 group"
                >
                  {/* Icon in Circular Badge */}
                  <div className="w-14 h-14 rounded-full bg-[#fde8e9] dark:bg-[var(--bg-badge)] border border-[#f8b4b7] dark:border-[var(--bg-badge-border)] flex items-center justify-center group-hover:bg-[#E5252B] group-hover:text-white group-hover:border-[#E5252B] group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <div className="group-hover:text-white transition-colors duration-300">
                      {getIcon(srv.iconName)}
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1e2327] dark:text-[var(--text-title)] group-hover:text-[#E5252B] transition-colors font-['Montserrat',sans-serif]">
                    {t(`services.items.${srv.id}.title`)}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                    {t(`services.items.${srv.id}.description`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
