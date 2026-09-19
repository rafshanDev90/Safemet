import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADVANTAGES, ASSETS } from '../data';
import { Play, X } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const AdvantagesSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(ADVANTAGES[0].id);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  return (
    <section id="advantages" className="w-full bg-white dark:bg-[var(--bg-primary)] text-white">
      <Container className="px-0 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Why Choose Us / Accordion */}
          <Reveal className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-[#202528]">
            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-[1.5px] bg-[#E5252B]" />
              <span className="text-[13px] font-bold tracking-[0.25em] text-[#9ca3af] uppercase font-['Montserrat',sans-serif]">
                {t('advantages.eyebrow')}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-wider mb-8 sm:mb-10 font-['Montserrat',sans-serif]">
              {t('advantages.title')}
            </h2>

            {/* Advantages Interactive Accordion */}
            <div className="space-y-3 sm:space-y-4">
              {ADVANTAGES.map((adv) => {
                const isOpen = activeTab === adv.id;
                return (
                  <div
                    key={adv.id}
                    id={`advantage-item-${adv.id}`}
                    className="rounded-none overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setActiveTab(isOpen ? '' : adv.id)}
                      className={`w-full min-h-[44px] text-left px-5 sm:px-6 py-4 flex items-center justify-between text-sm sm:text-[15px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                        isOpen
                          ? 'bg-[#2b3136] text-white border-l-2 border-[#E5252B]'
                          : 'bg-[#2a3035] text-neutral-300 hover:bg-[#343b42] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#E5252B] font-bold text-lg leading-none">—</span>
                        <span>{t(`advantages.items.${adv.id}.title`)}</span>
                      </span>
                    </button>

                    {/* Content Collapse */}
                    {isOpen && (
                      <div className="bg-[#1f2428] px-6 sm:px-7 py-5 text-sm sm:text-[15px] text-neutral-300 leading-relaxed border-l-2 border-[#E5252B] animate-fadeIn">
                        {t(`advantages.items.${adv.id}.content`)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Right Column: TVC Video Banner */}
          <Reveal delay={0.1} className="relative w-full min-h-[320px] sm:min-h-[440px] lg:min-h-[620px] overflow-hidden group bg-black">
          <img
            src={ASSETS.tvcWoman}
            alt={t('advantages.imageAlt')}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          />

          {/* Dark Overlay with TVC Label */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Left TVC Play Indicator matching screenshot */}
          <div
            onClick={() => setShowVideoModal(true)}
            className="absolute top-8 left-8 flex items-center gap-3 cursor-pointer group/btn"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover/btn:bg-[#E5252B] group-hover/btn:scale-110 transition-all duration-300">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-widest uppercase drop-shadow-md">
              {t('advantages.tvc')}
            </span>
          </div>

          {/* Floating Watch Commercial Button at Center */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/40 hover:bg-[#E5252B] border-2 border-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl focus:outline-none"
            aria-label={t('advantages.tvcAria')}
          >
            <Play className="w-9 h-9 text-white fill-white ml-1" />
          </button>
        </Reveal>
        </div>
      </Container>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-[#181b1e] rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-700 animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#202528] flex items-center justify-between border-b border-neutral-700">
              <span className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#E5252B] fill-[#E5252B]" /> {t('advantages.modalTitleSuffix')}
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center relative">
              <img
                src={ASSETS.tvcWoman}
                alt={t('advantages.videoStillAlt')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40">
                <div className="w-16 h-16 rounded-full bg-[#E5252B] flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <h4 className="text-white text-lg font-bold uppercase tracking-wider mb-1">
                  {t('advantages.modalHeading')}
                </h4>
                <p className="text-neutral-300 text-xs max-w-md">
                  {t('advantages.modalTagline')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
