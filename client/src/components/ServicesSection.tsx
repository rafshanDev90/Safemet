import React from 'react';
import { SERVICES, ASSETS } from '../data';
import { Compass, Wrench, ShieldCheck, Cog } from 'lucide-react';
import { Container } from './Container';

export const ServicesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'drafting':
        return <Compass className="w-5 h-5 text-[#E5252B]" />;
      case 'installation':
        return <Wrench className="w-5 h-5 text-[#E5252B]" />;
      case 'testing':
        return <ShieldCheck className="w-5 h-5 text-[#E5252B]" />;
      case 'maintenance':
        return <Cog className="w-5 h-5 text-[#E5252B]" />;
      default:
        return <Wrench className="w-5 h-5 text-[#E5252B]" />;
    }
  };

  return (
    <section id="services" className="w-full bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="flex items-center gap-4 pb-6 mb-10 border-b border-neutral-200">
          <div className="w-8 md:w-12 h-[2.5px] bg-[#222629]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1f2427] tracking-wider uppercase font-['Montserrat',sans-serif]">
            OUR SERVICES
          </h2>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Intro Quote + Inspection Photo */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Red Quote Block */}
            <div className="flex items-start gap-3">
              <span className="text-4xl sm:text-5xl font-serif text-[#E5252B] leading-none font-bold select-none">
                “
              </span>
              <p className="text-xs sm:text-[13px] font-medium text-neutral-700 leading-relaxed pt-1">
                We are a full-service provider of fire safety inspection, testing, and maintenance services in all areas of fire protection requirements.
              </p>
            </div>

            {/* Inspection Engineer Photo */}
            <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden shadow-md border border-neutral-200 group">
              <img
                src={ASSETS.inspection}
                alt="Fire Safety Inspection & Testing Engineer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#E5252B] px-2 py-0.5 rounded-xs">
                  Certified Field Service
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Services Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                id={`service-card-${srv.id}`}
                className="flex flex-col space-y-3 group"
              >
                {/* Icon in Circular Badge */}
                <div className="w-12 h-12 rounded-full bg-[#fde8e9] border border-[#f8b4b7] flex items-center justify-center group-hover:bg-[#E5252B] group-hover:text-white group-hover:border-[#E5252B] transition-all duration-300 shadow-xs">
                  <div className="group-hover:text-white transition-colors duration-300">
                    {getIcon(srv.iconName)}
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1e2327] group-hover:text-[#E5252B] transition-colors font-['Montserrat',sans-serif]">
                  {srv.title}
                </h3>

                {/* Service Description */}
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {srv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
