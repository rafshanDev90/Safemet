import React from 'react';
import { useTranslation } from 'react-i18next';
import { PARTNERS } from '../data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const PartnersSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="partners" className="w-full bg-[#f8f9fa] dark:bg-[var(--bg-tertiary)] py-16 md:py-24 border-t border-b border-neutral-200 dark:border-[var(--border-default)]">
      <Container>
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between pb-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
                {t('partners.title')}
              </h2>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-neutral-600 dark:text-[var(--text-muted)]">
              <button
                className="w-11 h-11 flex items-center justify-center rounded hover:bg-neutral-200 dark:hover:bg-[var(--bg-hover)] hover:text-[#E5252B] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none cursor-pointer"
                aria-label={t('partners.prev')}
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center rounded hover:bg-neutral-200 dark:hover:bg-[var(--bg-hover)] hover:text-[#E5252B] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none cursor-pointer"
                aria-label={t('partners.next')}
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Brand Logos Grid (2 per row on mobile, 4 on tablet/desktop) */}
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center bg-white py-8 sm:py-10 px-4 sm:px-6 rounded-xs border border-neutral-200 dark:border-[var(--border-default)] shadow-xs">
            {/* Tyco Logo */}
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 w-full">
              <div className="text-center font-sans">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0089cf] lowercase italic">
                  tyco
                </span>
              </div>
            </div>

            {/* Hochiki Logo */}
            <div className="flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 w-full">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 bg-[#E5252B] rounded-xs flex items-center justify-center text-white font-black text-sm">
                  H
                </div>
                <span className="text-3xl sm:text-4xl font-black tracking-widest text-[#111827] uppercase">
                  HOCHIKI
                </span>
              </div>
            </div>

            {/* Pentair Logo */}
            <div className="flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 w-full">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#006494] flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                </div>
                <span className="text-3xl sm:text-4xl font-black tracking-widest text-[#006494] uppercase">
                  PENTAIR
                </span>
              </div>
            </div>

            {/* LIFECO Logo */}
            <div className="flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 w-full">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-[#E5252B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9 7 4 10 4 15a8 8 0 0 0 16 0c0-5-5-8-8-13zm0 18a5 5 0 0 1-5-5c0-3 3-5 5-8 2 3 5 5 5 8a5 5 0 0 1-5 5z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#1a1a1a] uppercase leading-none">
                    LIFECO
                  </span>
                  <span className="text-[9px] font-bold text-neutral-500 tracking-tighter uppercase">
                    Fire &amp; Safety Equipment Co.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
