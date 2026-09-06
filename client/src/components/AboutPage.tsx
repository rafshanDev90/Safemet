import React from 'react';
import { ASSETS, TEAM_MEMBERS, HIGHLIGHT_FEATURES } from '../data';
import { Wrench, Headset, Star, ArrowRight } from 'lucide-react';
import { Container } from './Container';

interface AboutPageProps {
  onNavigateHome?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full bg-white flex flex-col font-['Montserrat',sans-serif]">
      {/* 1. HERO BANNER WITH HEXAGON GRAPHICS */}
      <section className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
        {/* Background Composite Image */}
        <img
          src={ASSETS.aboutBanner}
          alt="About Safemet Fire Safety Solutions"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-widest uppercase">
            ABOUT US
          </h1>
          <div className="w-16 sm:w-20 h-[3px] bg-white mx-auto mt-3 sm:mt-4 shadow-sm" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION */}
      <section className="w-full bg-[#f8f9fa] border-b border-neutral-200 py-3 sm:py-3.5">
        <Container className="flex items-center justify-center">
          <nav className="flex items-center space-x-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <button
              onClick={onNavigateHome}
              className="text-neutral-500 hover:text-[#E5252B] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span className="text-neutral-900 font-black">
              &rarr;
            </span>
            <span className="text-neutral-900 font-extrabold">
              ABOUT US
            </span>
          </nav>
        </Container>
      </section>

      {/* 3. A FEW WORDS ABOUT US */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-20">
        <Container>
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-4 mb-8">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629]" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1f2427] tracking-wider uppercase font-['Montserrat',sans-serif]">
              A FEW WORDS ABOUT US
            </h2>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6 text-xs sm:text-[13px] md:text-sm text-neutral-700 leading-relaxed font-normal max-w-6xl">
            <p>
              At 1981 PRAN-RFL Group started its business as a processor of fruits and vegetables in Bangladesh. Now PRAN-RFL Group is the leading agricultural and plastic product producer and manufacturer. Beside food and plastic products Rangpur Metal Industries Limited (RMIL) being a sister concern of PRAN-RFL Group starts importing world class fire safety equipment for serving all over our country. In the beginning the sales, servicing and marketing started under the banner of PRAN-RFL Fire Safety.
            </p>

            <p>
              Safemet Fire Safety Equipment &amp; Solution as expressed by the name is dedicated to provide quality fire safety products and services. All of the products are imported from various countries of first world which are UL listed and FM approved. We have done a lots of big projects in different Government and Non- government organization. The Span of work also extends to different sectors like power, commercial and RMG industries. Our clients are our advocates and they speak for our quality products and services. Our own refill plant helps us to provide excellent quality refills with accurate measurements for fire extinguisher with high influence of technology. Besides fire safety we provide surveillance system as well.
            </p>

            <p className="font-medium text-neutral-800 pt-1">
              We welcome the opportunity to become your safety partner in your valuable business.
            </p>
          </div>
        </Container>
      </section>

      {/* 4. OUR MANAGEMENT TEAM */}
      <section className="w-full bg-[#202528] text-white py-14 sm:py-18 md:py-20">
        <Container>
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-4 mb-10 md:mb-12">
            <div className="w-8 md:w-12 h-[2.5px] bg-white/70" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wider uppercase font-['Montserrat',sans-serif]">
              OUR MANAGEMENT TEAM
            </h2>
          </div>

          {/* 3 Executive Cards Grid (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                id={`team-card-${member.id}`}
                className="bg-[#282e32]/90 border border-neutral-700/60 p-6 sm:p-8 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:border-neutral-500/80 group"
              >
                {/* Title */}
                <h3 className="text-xs sm:text-[13px] font-extrabold text-[#E5252B] tracking-wider uppercase mb-6 font-['Montserrat',sans-serif]">
                  {member.title}
                </h3>

                {/* Photo with clean white frame */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white p-1.5 shadow-md mb-6 overflow-hidden flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Role / Description */}
                <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. 3 FEATURE HIGHLIGHTS */}
      <section className="w-full bg-white py-12 sm:py-16 border-t border-b border-neutral-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1: 24/7 Service */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-xs flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1a1e21] font-['Montserrat',sans-serif]">
                  {HIGHLIGHT_FEATURES[0].title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {HIGHLIGHT_FEATURES[0].description}
                </p>
              </div>
            </div>

            {/* Feature 2: Technical Support & Training */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-xs flex items-center justify-center">
                  <Headset className="w-7 h-7 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1a1e21] font-['Montserrat',sans-serif]">
                  {HIGHLIGHT_FEATURES[1].title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {HIGHLIGHT_FEATURES[1].description}
                </p>
              </div>
            </div>

            {/* Feature 3: Continued Routine Maintenance */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-xs flex items-center justify-center">
                  <Star className="w-7 h-7 text-[#E5252B] stroke-[2]" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1a1e21] font-['Montserrat',sans-serif]">
                  {HIGHLIGHT_FEATURES[2].title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {HIGHLIGHT_FEATURES[2].description}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
