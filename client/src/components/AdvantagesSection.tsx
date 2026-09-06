import React, { useState } from 'react';
import { ADVANTAGES, ASSETS } from '../data';
import { Play, X } from 'lucide-react';
import { Container } from './Container';

export const AdvantagesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(ADVANTAGES[0].id);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  return (
    <section id="advantages" className="w-full bg-[#1b1f22] text-white">
      <Container className="px-0 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Why Choose Us / Accordion */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-[#202528]">
            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[1.5px] bg-[#E5252B]" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#9ca3af] uppercase font-['Montserrat',sans-serif]">
                WHY CHOOSE US
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wider mb-6 sm:mb-8 font-['Montserrat',sans-serif]">
              OUR ADVANTAGES
            </h2>

            {/* Advantages Interactive Accordion */}
            <div className="space-y-2.5 sm:space-y-3">
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
                      className={`w-full min-h-[44px] text-left px-4 sm:px-5 py-3 flex items-center justify-between text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                        isOpen
                          ? 'bg-[#2b3136] text-white border-l-2 border-[#E5252B]'
                          : 'bg-[#2a3035] text-neutral-300 hover:bg-[#343b42] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#E5252B] font-bold text-base leading-none">—</span>
                        <span>{adv.title}</span>
                      </span>
                    </button>

                    {/* Content Collapse */}
                    {isOpen && (
                      <div className="bg-[#1f2428] px-5 sm:px-6 py-4 text-xs sm:text-[13px] text-neutral-300 leading-relaxed border-l-2 border-[#E5252B] animate-fadeIn">
                        {adv.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: TVC Video Banner */}
          <div className="relative w-full min-h-[260px] sm:min-h-[360px] lg:min-h-[500px] overflow-hidden group bg-black">
          <img
            src={ASSETS.tvcWoman}
            alt="Safemete TVC Fire Safety Presentation"
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
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover/btn:bg-[#E5252B] group-hover/btn:scale-110 transition-all duration-300">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <span className="text-white font-extrabold text-sm tracking-widest uppercase drop-shadow-md">
              TVC
            </span>
          </div>

          {/* Floating Watch Commercial Button at Center */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/40 hover:bg-[#E5252B] border-2 border-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl focus:outline-none"
            aria-label="Play TV Commercial"
          >
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </button>
        </div>
        </div>
      </Container>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-[#181b1e] rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#202528] flex items-center justify-between border-b border-neutral-700">
              <span className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#E5252B] fill-[#E5252B]" /> SAFEMETE TV Commercial - Fire Safety Solution
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
                alt="Video Still"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40">
                <div className="w-16 h-16 rounded-full bg-[#E5252B] flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <h4 className="text-white text-lg font-bold uppercase tracking-wider mb-1">
                  Safemete TV Commercial
                </h4>
                <p className="text-neutral-300 text-xs max-w-md">
                  Delivering UL listed and FM approved fire safety systems across Bangladesh since 2015.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
