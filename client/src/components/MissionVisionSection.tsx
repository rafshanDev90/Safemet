import React from 'react';
import { Target, Eye, Quote } from 'lucide-react';
import { Container } from './Container';

export const MissionVisionSection: React.FC = () => {
  return (
    <section id="mission-vision" className="w-full bg-white py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <div className="flex items-center gap-4 pb-8 mb-12 border-b border-neutral-200">
          <div className="w-8 md:w-12 h-[2.5px] bg-[#222629]" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] tracking-wider uppercase font-['Montserrat',sans-serif]">
            OUR MISSION &amp; VISION
          </h2>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-20">
          {/* Mission Card */}
          <div className="bg-[#f4f5f6] border-l-4 border-[#E5252B] p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#fde8e9] border border-[#f8b4b7] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#E5252B]" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[#1e2327] font-['Montserrat',sans-serif]">
                OUR MISSION
              </h3>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
              To safeguard lives, property, and business continuity across Bangladesh by delivering
              internationally certified — UL listed and FM approved — fire safety equipment and
              engineered protection systems, supported by end-to-end design, installation, testing,
              and maintenance services of uncompromising quality.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#f4f5f6] border-l-4 border-[#E5252B] p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#fde8e9] border border-[#f8b4b7] flex items-center justify-center">
                <Eye className="w-6 h-6 text-[#E5252B]" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[#1e2327] font-['Montserrat',sans-serif]">
                OUR VISION
              </h3>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
              To be the most trusted and preferred fire safety solutions partner in Bangladesh and
              across South Asia — recognised for engineering excellence, integrity, and
              round-the-clock responsiveness — where every facility we protect operates with
              complete confidence in its fire safety readiness.
            </p>
          </div>
        </div>

        {/* Message from the Chairman — Image on Left */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center mb-16 lg:mb-20">
          {/* Headshot */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="w-60 h-60 sm:w-72 sm:h-72 bg-white p-2 shadow-md border border-neutral-200 overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/chairman.jpg"
                alt="Chairman of Safemet Fire Safety Equipment & Solution"
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
                MESSAGE FROM THE CHAIRMAN
              </span>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed mb-5">
              From our very first installation, our resolve has been simple: no facility should ever
              be at risk for want of reliable fire protection. Safemet was founded on the belief that
              world-class, UL listed and FM approved fire safety equipment should be within reach of
              every business in Bangladesh. Today, supported by our parent group and our own
              state-of-the-art refill plant, we are able to bring you internationally trusted
              equipment, professional installation, and dependable after-sales service all under one
              roof. We consider it a privilege to protect your people and your business.
            </p>
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-base font-extrabold text-[#1e2327] uppercase tracking-wider font-['Montserrat',sans-serif]">
                Chairman&rsquo;s Name
              </p>
              <p className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                Chairman, Safemet Fire Safety Equipment &amp; Solution
              </p>
            </div>
          </div>
        </div>

        {/* Message from the CEO — Image on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Headshot */}
          <div className="md:col-span-4 md:order-last flex justify-center md:justify-end">
            <div className="w-60 h-60 sm:w-72 sm:h-72 bg-white p-2 shadow-md border border-neutral-200 overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/ceo.jpg"
                alt="CEO of Safemet Fire Safety Equipment & Solution"
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
                MESSAGE FROM THE CEO
              </span>
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed mb-5">
              In an era when fire safety regulations are growing ever more rigorous, we believe that
              protection begins long before an incident occurs. Our team of certified engineers works
              with you from design and drawing through installation, testing and commissioning, and
              continues with regular preventive maintenance so your system is always ready to
              respond. Whether you operate in the power, commercial, or ready-made garment sector, we
              commit to serving you with the same technical discipline and care we apply to our
              largest national projects.
            </p>
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-base font-extrabold text-[#1e2327] uppercase tracking-wider font-['Montserrat',sans-serif]">
                CEO&rsquo;s Name
              </p>
              <p className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                Chief Executive Officer, Safemet Fire Safety Equipment &amp; Solution
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};