import React from 'react';
import { ChevronUp, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { Container } from './Container';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full bg-[#1e2327] text-white relative font-['Montserrat',sans-serif]">
      {/* Main Footer Container */}
      <div className="w-full py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Column 1: About Us */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 bg-[#E5252B] inline-block" />
              ABOUT US
            </h4>
            <p className="text-[13px] sm:text-sm text-neutral-300 leading-relaxed">
              Safemet Fire Safety Equipment &amp; Solution as expressed by the name is dedicated to provide quality fire safety products and services. All of the products are imported from various countries of first world which are UL listed and FM approved.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                id="footer-fb"
                className="w-9 h-9 bg-[#2e353c] hover:bg-[#E5252B] transition-colors flex items-center justify-center text-white text-sm font-bold font-serif"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                id="footer-in"
                className="w-9 h-9 bg-[#2e353c] hover:bg-[#E5252B] transition-colors flex items-center justify-center text-white text-sm font-bold font-sans"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>

          {/* Column 2: Get In Touch */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 bg-[#E5252B] inline-block" />
              GET IN TOUCH
            </h4>

            <div className="space-y-3 text-[13px] sm:text-sm">
              <div>
                <span className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider block">
                  HOTLINE
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E5252B] flex-shrink-0" />
                  <a
                    href="tel:+8801742264946"
                    className="text-white font-bold hover:text-[#E5252B] transition-colors"
                  >
                    +8801742-264946
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider block">
                  LANDLINE
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E5252B] flex-shrink-0" />
                  <a
                    href="tel:+8802588814123"
                    className="text-neutral-200 hover:text-[#E5252B] transition-colors"
                  >
                    +8802588814123
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider block">
                  E-MAIL
                </span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E5252B] flex-shrink-0" />
                  <a
                    href="mailto:inforngroupbd@gmail.com"
                    className="text-neutral-200 hover:text-[#E5252B] transition-colors"
                  >
                    inforngroupbd@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider block">
                  WEBSITE
                </span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#E5252B] flex-shrink-0" />
                  <a
                    href="https://www.rngroupinfo.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-200 hover:text-[#E5252B] transition-colors"
                  >
                    www.rngroupinfo.com
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider block">
                  ADDRESS
                </span>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E5252B] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-200 leading-relaxed">
                    Holding no 9/2, 4th Floor, Avenue 5, Block B, Section 6, Mirpur, Dhaka-1216.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Useful Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 bg-[#E5252B] inline-block" />
              USEFUL LINKS
            </h4>

            <ul className="space-y-2.5 text-[13px] sm:text-sm">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => handleLinkClick(e, 'projects')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  Picture Gallery
                </a>
              </li>
              <li>
                <a
                  href="#advantages"
                  onClick={(e) => handleLinkClick(e, 'advantages')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  Video Gallery
                </a>
              </li>
              <li>
                <a
                  href="/products/fire-protection-system"
                  onClick={(e) => handleLinkClick(e, '/products/fire-protection-system')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  Catalogue
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-neutral-300 hover:text-[#E5252B] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        </Container>
      </div>

      {/* Copyright Sub-footer */}
      <div className="w-full bg-[#161a1d] py-4 border-t border-neutral-800/80">
        <Container className="text-center">
          <p className="text-[13px] text-neutral-400 font-normal">
            © 2026. All Rights Reserved
          </p>
        </Container>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        id="scroll-to-top-btn"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#E5252B] hover:bg-[#c21e24] text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[3]" />
      </button>
    </footer>
  );
};
