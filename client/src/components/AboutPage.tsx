import React from 'react';
import { useTranslation } from 'react-i18next';
import { ASSETS, TEAM_MEMBERS, HIGHLIGHT_FEATURES } from '../data';
import { Wrench, Headset, Star, ArrowRight } from 'lucide-react';
import { Container } from './Container';

interface AboutPageProps {
  onNavigateHome?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white dark:bg-[var(--bg-primary)] flex flex-col font-['Montserrat',sans-serif]">
      {/* 1. HERO BANNER WITH HEXAGON GRAPHICS */}
      <section className="relative w-full h-[320px] sm:h-[400px] md:h-[470px] lg:h-[540px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
        {/* Background Composite Image */}
        <img
          src={ASSETS.aboutBanner}
          alt={t('about.bannerAlt')}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hexagon Graphic SVG Accents Overlaid */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
          <svg
            className="w-full h-full max-w-[1200px]"
            viewBox="0 0 1000 400"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            {/* Hexagon 1 Center */}
            <polygon points="500,100 580,150 580,250 500,300 420,250 420,150" />
            {/* Hexagon 2 Right */}
            <polygon points="660,100 740,150 740,250 660,300 580,250 580,150" />
            {/* Hexagon 3 Left */}
            <polygon points="340,100 420,150 420,250 340,300 260,250 260,150" />
            {/* Connecting lines */}
            <line x1="500" y1="100" x2="500" y2="40" strokeDasharray="4 4" />
            <line x1="660" y1="300" x2="660" y2="360" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Centered Heading */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-widest uppercase">
            {t('about.title')}
          </h1>
          <div className="w-16 sm:w-20 h-[3px] bg-white mx-auto mt-3 sm:mt-4 shadow-sm" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION */}
      <section className="w-full bg-[#f8f9fa] dark:bg-[var(--bg-tertiary)] border-b border-neutral-200 dark:border-[var(--border-default)] py-3.5 sm:py-4">
        <Container className="flex items-center justify-center">
          <nav className="flex items-center space-x-2 text-[13px] sm:text-sm font-bold uppercase tracking-wider">
            <button
              onClick={onNavigateHome}
              className="text-neutral-500 dark:text-[var(--text-dim)] hover:text-[#E5252B] transition-colors cursor-pointer"
            >
              {t('about.breadcrumb')}
            </button>
            <span className="text-neutral-900 dark:text-[var(--text-title)] font-black">
              &rarr;
            </span>
            <span className="text-neutral-900 dark:text-[var(--text-title)] font-extrabold">
              {t('about.title')}
            </span>
          </nav>
        </Container>
      </section>

      {/* 3. A FEW WORDS ABOUT US */}
      <section className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 sm:py-20 md:py-28">
        <Container>
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-6 mb-10">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
              {t('about.heading')}
            </h2>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6 text-sm sm:text-[15px] md:text-base text-neutral-700 dark:text-[var(--text-muted)] leading-relaxed font-normal max-w-6xl">
            <p>
              {t('about.p1')}
            </p>

            <p>
              {t('about.p2')}
            </p>

            <p className="font-medium text-neutral-800 dark:text-[var(--text-strong)] pt-1">
              {t('about.p3')}
            </p>
          </div>
        </Container>
      </section>

      {/* 4. OUR MANAGEMENT TEAM */}
      <section className="w-full bg-[#202528] text-white py-16 sm:py-20 md:py-28">
        <Container>
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-6 mb-12 md:mb-14">
            <div className="w-8 md:w-12 h-[2.5px] bg-white/70" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase font-['Montserrat',sans-serif]">
              {t('about.teamTitle')}
            </h2>
          </div>

          {/* 3 Executive Cards Grid (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {TEAM_MEMBERS.map((member) => {
              const memberTitle = t(`about.team.${member.id}.title`);
              return (
              <div
                key={member.id}
                id={`team-card-${member.id}`}
                className="bg-[#282e32]/90 border border-neutral-700/60 p-8 sm:p-10 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:border-neutral-500/80 group"
              >
                {/* Title */}
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#E5252B] tracking-wider uppercase mb-6 font-['Montserrat',sans-serif]">
                  {memberTitle}
                </h3>

                {/* Photo with clean white frame */}
                <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white p-1.5 shadow-md mb-6 overflow-hidden flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={memberTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Role / Description */}
                <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                  {t(`about.team.${member.id}.description`)}
                </p>
              </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. 3 FEATURE HIGHLIGHTS */}
      <section className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 sm:py-20 border-t border-b border-neutral-200 dark:border-[var(--border-default)]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {/* Feature 1: 24/7 Service */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-12 h-12 rounded-xs flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1a1e21] dark:text-[var(--text-strong)] font-['Montserrat',sans-serif]">
                  {t(`about.features.${HIGHLIGHT_FEATURES[0].id}.title`)}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                  {t(`about.features.${HIGHLIGHT_FEATURES[0].id}.description`)}
                </p>
              </div>
            </div>

            {/* Feature 2: Technical Support & Training */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-12 h-12 rounded-xs flex items-center justify-center">
                  <Headset className="w-8 h-8 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1a1e21] dark:text-[var(--text-strong)] font-['Montserrat',sans-serif]">
                  {t(`about.features.${HIGHLIGHT_FEATURES[1].id}.title`)}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                  {t(`about.features.${HIGHLIGHT_FEATURES[1].id}.description`)}
                </p>
              </div>
            </div>

            {/* Feature 3: Continued Routine Maintenance */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-12 h-12 rounded-xs flex items-center justify-center">
                  <Star className="w-8 h-8 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1a1e21] dark:text-[var(--text-strong)] font-['Montserrat',sans-serif]">
                  {t(`about.features.${HIGHLIGHT_FEATURES[2].id}.title`)}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed">
                  {t(`about.features.${HIGHLIGHT_FEATURES[2].id}.description`)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
