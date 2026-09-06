import React from 'react';
import { Container } from './Container';

export const AboutSeoSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-10 md:py-12 border-t border-neutral-200">
      <Container className="text-center">
        <h3 className="text-xs sm:text-[13px] font-extrabold tracking-wider text-[#1a1d20] uppercase mb-3 font-['Montserrat',sans-serif]">
          FIRE SAFETY EQUIPMENT: BEST SUPPLIER IN BANGLADESH
        </h3>
        <p className="text-[11px] sm:text-xs text-[#555a60] leading-relaxed max-w-4xl mx-auto font-normal">
          From air tanks to houses, fire fighting equipment is a necessity for any department and the right gear at the right time can make all the difference in a fight against a blaze. At Firehouse Supplies, we, Safemet as a fire safety equipment &amp; solution are proud to be the largest supplier of fire fighting equipment and gear in Bangladesh.
        </p>
      </Container>
    </section>
  );
};
