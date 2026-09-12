import React, { useState } from 'react';
import { ASSETS } from '../data';
import { Mail, MapPin, Phone, Globe, CheckCircle2 } from 'lucide-react';
import { Container } from './Container';

interface ContactPageProps {
  onNavigateHome?: () => void;
}

const OFFICES = [
  {
    id: 'office-1',
    title: 'Dhaka Office',
    address: 'Holding no 9/2, 4th Floor, Avenue 5, Block B, Section 6, Mirpur, Dhaka-1216',
    contact: '01992592281',
  },
  {
    id: 'office-2',
    title: 'Bogura Office',
    address: 'Prottasha, Riyaz Kazi Lane, Sutrapur, Bogura-5800',
    contact: '01826603900',
  },
  {
    id: 'office-3',
    title: 'Rajshahi Office',
    address: 'City Bypass Road, Court Station Mor, Rajshahi',
    contact: '01846-310833',
  },
  {
    id: 'office-4',
    title: 'Malaysia Office',
    address: 'Court 10, Jalan SS15, 47500, Subang Jaya, Selangor, Malaysia',
    contact: '',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full bg-white flex flex-col font-['Montserrat',sans-serif]">
      {/* 1. HERO BANNER WITH COMPOSITE ASSET & HEXAGON ACCENTS */}
      <section className="relative w-full h-[320px] sm:h-[400px] md:h-[470px] lg:h-[540px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
        {/* Background Composite Image */}
        <img
          src={ASSETS.aboutBanner}
          alt="Contact Safemet Fire Safety Equipment & Solution"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Vignette & Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hexagon Graphic Overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
          <svg
            className="w-full h-full max-w-[1200px]"
            viewBox="0 0 1000 400"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <polygon points="500,100 580,150 580,250 500,300 420,250 420,150" />
            <polygon points="660,100 740,150 740,250 660,300 580,250 580,150" />
            <polygon points="340,100 420,150 420,250 340,300 260,250 260,150" />
            <line x1="500" y1="100" x2="500" y2="40" strokeDasharray="4 4" />
            <line x1="660" y1="300" x2="660" y2="360" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Centered Headline */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-widest uppercase">
            CONTACT US
          </h1>
          <div className="w-16 sm:w-20 h-[3px] bg-white mx-auto mt-3 sm:mt-4 shadow-sm" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION */}
      <section className="w-full bg-[#f8f9fa] border-b border-neutral-200 py-3.5 sm:py-4">
        <Container className="flex items-center justify-center">
          <nav className="flex items-center space-x-2 text-[13px] sm:text-sm font-bold uppercase tracking-wider">
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
              CONTACT US
            </span>
          </nav>
        </Container>
      </section>

      {/* 3. MAIN CONTACT CONTENT: FORM + SIDEBAR */}
      <section className="w-full bg-white py-16 sm:py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Form (8 cols) */}
            <div className="lg:col-span-8 flex flex-col">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-8">
                Get in Touch
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 p-8 text-center flex flex-col items-center justify-center animate-fadeIn shadow-sm">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3" />
                  <h4 className="text-xl font-extrabold text-neutral-900 mb-2">Thank you! Message Sent.</h4>
                  <p className="text-sm sm:text-base text-neutral-600">
                    Our safety support engineers have received your inquiry and will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name*"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white text-neutral-800 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base border border-neutral-300 focus:outline-none focus:border-[#E5252B] focus:ring-1 focus:ring-[#E5252B] transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your E-mail*"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white text-neutral-800 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base border border-neutral-300 focus:outline-none focus:border-[#E5252B] focus:ring-1 focus:ring-[#E5252B] transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone */}
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Your Phone*"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white text-neutral-800 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base border border-neutral-300 focus:outline-none focus:border-[#E5252B] focus:ring-1 focus:ring-[#E5252B] transition-all"
                    />
                  </div>

                  {/* Row 3: Message Textarea */}
                  <div>
                    <textarea
                      rows={6}
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white text-neutral-800 placeholder:text-neutral-500 px-4 py-3.5 text-xs sm:text-sm border border-neutral-300 focus:outline-none focus:border-[#E5252B] focus:ring-1 focus:ring-[#E5252B] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      id="contact-form-submit-btn"
                      className="bg-[#C22126] hover:bg-[#a51a1e] text-white font-extrabold text-sm tracking-widest uppercase px-12 py-4 sm:px-14 sm:py-5 transition-colors duration-200 cursor-pointer shadow-sm"
                    >
                      CONTACT US
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Contact Info Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col space-y-8 lg:pl-6">
              {/* GET SOCIAL */}
              <div className="space-y-3 pb-6 border-b border-neutral-200">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  GET SOCIAL
                </h3>
                <div className="flex items-center space-x-3 text-neutral-800">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#E5252B] transition-colors font-serif font-bold text-base"
                    aria-label="Facebook"
                  >
                    f
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#E5252B] transition-colors font-sans font-bold text-sm"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                </div>
              </div>

              {/* HOTLINE */}
              <div className="space-y-2 pb-6 border-b border-neutral-200">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  HOTLINE
                </h3>
                <div className="flex items-center gap-2.5 text-[#C22126]">
                  <Phone className="w-5 h-5 text-[#C22126] stroke-[2.5]" />
                  <a
                    href="tel:+8801742264946"
                    className="text-sm sm:text-[15px] font-bold text-neutral-800 hover:text-[#E5252B] transition-colors"
                  >
                    +8801742-264946
                  </a>
                </div>
              </div>

              {/* LANDLINE */}
              <div className="space-y-2 pb-6 border-b border-neutral-200">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  LANDLINE
                </h3>
                <div className="flex items-center gap-2.5 text-[#C22126]">
                  <Phone className="w-5 h-5 text-[#C22126] stroke-[2.5]" />
                  <a
                    href="tel:+8802588814123"
                    className="text-sm sm:text-[15px] font-bold text-neutral-800 hover:text-[#E5252B] transition-colors"
                  >
                    +8802588814123
                  </a>
                </div>
              </div>

              {/* E-MAIL */}
              <div className="space-y-2 pb-6 border-b border-neutral-200">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  E-MAIL
                </h3>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[#C22126] stroke-[2]" />
                  <a
                    href="mailto:inforngroupbd@gmail.com"
                    className="text-sm sm:text-[15px] font-medium text-neutral-700 hover:text-[#E5252B] transition-colors"
                  >
                    inforngroupbd@gmail.com
                  </a>
                </div>
              </div>

              {/* WEBSITE */}
              <div className="space-y-2 pb-6 border-b border-neutral-200">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  WEBSITE
                </h3>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-[#C22126] stroke-[2]" />
                  <a
                    href="https://www.rngroupinfo.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm sm:text-[15px] font-medium text-neutral-700 hover:text-[#E5252B] transition-colors"
                  >
                    www.rngroupinfo.com
                  </a>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="space-y-2">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-neutral-900">
                  ADDRESS
                </h3>
                <div className="flex items-start gap-2.5 text-neutral-700">
                  <MapPin className="w-5 h-5 text-[#C22126] stroke-[2] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-[15px] font-medium leading-relaxed">
                    Holding no 9/2, 4th Floor, Avenue 5, Block B, Section 6, Mirpur, Dhaka-1216.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. OUR OFFICES */}
      <section className="w-full bg-[#f4f5f6] py-16 sm:py-20 md:py-28 border-t border-neutral-200">
        <Container>
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-8 mb-12 border-b border-neutral-300">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] tracking-wider uppercase font-['Montserrat',sans-serif]">
              OUR OFFICES
            </h2>
          </div>

          {/* Office Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {OFFICES.map((office) => (
              <div
                key={office.id}
                id={`office-card-${office.id}`}
                className="bg-white border border-neutral-200 p-7 sm:p-8 flex flex-col space-y-4 shadow-sm group"
              >
                {/* Icon in Circular Badge */}
                <div className="w-14 h-14 rounded-full bg-[#fde8e9] border border-[#f8b4b7] flex items-center justify-center group-hover:bg-[#E5252B] group-hover:border-[#E5252B] transition-all duration-300">
                  <MapPin className="w-6 h-6 text-[#E5252B] group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Office Title */}
                <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1e2327] font-['Montserrat',sans-serif]">
                  {office.title}
                </h3>

                {/* Office Address */}
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {office.address}
                </p>

                {/* Office Contact */}
                {office.contact && (
                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 mt-auto">
                    <Phone className="w-4 h-4 text-[#C22126] stroke-[2.5] flex-shrink-0" />
                    <a
                      href={`tel:${office.contact.replace(/[^0-9+]/g, '')}`}
                      className="text-sm font-bold text-neutral-800 hover:text-[#E5252B] transition-colors"
                    >
                      {office.contact}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};
