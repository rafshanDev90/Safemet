import React, { useState } from 'react';
import { ASSETS } from '../data';
import { CheckCircle2 } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

export const QuoteSection: React.FC = () => {
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
    <section id="contact" className="relative w-full overflow-hidden bg-black text-white">
      {/* Background Image Container */}
      <div className="relative w-full min-h-[560px] lg:min-h-[680px]">
        <img
          src={ASSETS.firefighterBg}
          alt="Firefighter Request a Quote"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center absolute inset-0"
        />

        {/* Dark Left Gradient Overlay to keep form high-contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-black/20" />

{/* Content Container */}
        <div className="relative z-10 py-20 lg:py-28">
          <Container>
            <Reveal className="max-w-xl">
              {/* Header Line & Title */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 md:w-12 h-[2.5px] bg-white" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wider uppercase font-['Montserrat',sans-serif]">
                  REQUEST A QUOTE
                </h2>
              </div>

            {/* Form */}
            {submitted ? (
              <div className="bg-white/10 backdrop-blur-md border border-emerald-500/50 p-6 rounded-xs text-center flex flex-col items-center justify-center animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h4 className="text-xl font-bold text-white mb-1">Quote Request Sent!</h4>
                <p className="text-sm text-neutral-300">
                  Our fire safety engineering department will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name*"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white text-neutral-900 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base font-medium border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E5252B] transition-all rounded-none"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your E-mail*"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white text-neutral-900 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base font-medium border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E5252B] transition-all rounded-none"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Your Phone *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white text-neutral-900 placeholder:text-neutral-500 px-5 py-4 text-sm sm:text-base font-medium border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E5252B] transition-all rounded-none"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Requirement / Equipment Details (Optional)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white text-neutral-900 placeholder:text-neutral-500 px-4 py-3 text-xs sm:text-sm font-medium border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E5252B] transition-all rounded-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    id="submit-quote-btn"
                    className="bg-[#C22126] hover:bg-[#a51a1e] text-white font-extrabold text-sm tracking-widest uppercase px-12 py-4 sm:px-14 sm:py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer shadow-md rounded-none"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>
            )}
          </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
};
