import React from 'react';
import { ASSETS } from '../data';
import { Container } from './Container';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-neutral-900">
      {/* Background Image Container */}
      <div className="relative w-full h-[360px] sm:h-[480px] md:h-[600px] lg:h-[761px]">
        <img
          src={ASSETS.heroCabinet}
          alt="Fire Safety Hose Cabinet"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Cinematic Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Left Floating Social Bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col z-20">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            id="hero-social-fb"
            className="w-10 h-10 bg-[#2f353b]/90 hover:bg-[#E5252B] transition-colors flex items-center justify-center text-white text-sm font-bold font-serif border-b border-neutral-700/50"
            aria-label="Facebook"
          >
            f
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            id="hero-social-in"
            className="w-10 h-10 bg-[#2f353b]/90 hover:bg-[#E5252B] transition-colors flex items-center justify-center text-white text-sm font-bold font-sans"
            aria-label="LinkedIn"
          >
            in
          </a>
        </div>

        {/* Hero Content Container */}
        <div className="absolute inset-0 flex items-center">
          <Container className="flex flex-col justify-center">
            <div className="max-w-xl md:max-w-2xl pl-1 sm:pl-4">
              {/* Top Accent Line */}
              <div className="w-16 sm:w-20 h-[2.5px] bg-white mb-4 sm:mb-6 shadow-sm" />

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[64px] font-extrabold text-white uppercase tracking-wider leading-[1.15] drop-shadow-md font-['Montserrat',sans-serif]">
                REACH ANYWHERE<br />
                TO FIGHT FIRE
              </h1>
            </div>
          </Container>
        </div>

        {/* Right Slider Indicators */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col space-y-2.5 z-20">
          <span className="w-2.5 h-6 bg-white rounded-full shadow-md" />
          <span className="w-2 h-2 bg-white/50 rounded-full hover:bg-white cursor-pointer transition-all" />
          <span className="w-2 h-2 bg-white/50 rounded-full hover:bg-white cursor-pointer transition-all" />
        </div>
      </div>
    </section>
  );
};
