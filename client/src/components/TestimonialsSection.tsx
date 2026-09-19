import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';
import { Container } from './Container';
import { Reveal } from './Reveal';

/* PLACEHOLDER DATA — Replace with real client feedback.
 * Real photos: drop portrait files into client/public/images/testimonials/
 * and set the `avatar` field below (e.g. "/images/testimonials/john.png").
 * While `avatar` is null an initials placeholder circle is rendered.
 */
const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Client Name 01',
    designation: 'Head of Operations',
    company: 'Company A',
    initials: 'CN',
    avatar: null,
    rating: 5,
    quote:
      'RN Group delivered our full factory fire protection installation ahead of schedule and within budget. Their engineers were professional, safety-focused, and meticulous in every phase of the work.',
  },
  {
    id: 't-2',
    name: 'Client Name 02',
    designation: 'Plant Director',
    company: 'Company B',
    initials: 'CN',
    avatar: null,
    rating: 5,
    quote:
      'The maintenance program they set up keeps all of our systems in perfect condition year-round. Whenever we call the emergency helpline, a technician responds immediately and resolves it quickly.',
  },
  {
    id: 't-3',
    name: 'Client Name 03',
    designation: 'Managing Director',
    company: 'Company C',
    initials: 'CN',
    avatar: null,
    rating: 5,
    quote:
      'From design and equipment selection to commissioning and staff training, the whole process was smooth and well documented. We trust them completely with our fire safety compliance.',
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="testimonials" className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="flex items-center gap-4 pb-8 mb-12 border-b border-neutral-200 dark:border-[var(--border-default)]">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
              {t('testimonials.title')}
            </h2>
          </div>
        </Reveal>

        {/* 3 Cards per Row (1 mobile, 2 tablet, 3 desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.1}>
              <div className="bg-white dark:bg-[var(--bg-card)] border border-neutral-200 dark:border-[var(--border-default)] rounded-xs shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-7 sm:p-8 flex flex-col h-full"
              >
              {/* Quote Mark */}
              <Quote className="w-8 h-8 text-[#E5252B] fill-[#E5252B]/10 mb-4 -ml-1" />

              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < item.rating ? 'text-[#E5252B] fill-[#E5252B]' : 'text-neutral-300 dark:text-[var(--border-strong)]'}`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-neutral-600 dark:text-[var(--text-muted)] leading-relaxed flex-1">
                “{t(`testimonials.items.${item.id}.quote`)}”
              </p>

              {/* Client Identity */}
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-[var(--border-soft)] flex items-center gap-3">
                {/* Placeholder circular avatar (initials) — swap with <img> using a real photo */}
                <div className="w-12 h-12 rounded-full bg-[#fde8e9] dark:bg-[var(--bg-badge)] border border-[#f8b4b7] dark:border-[var(--bg-badge-border)] flex items-center justify-center text-[#E5252B] font-extrabold uppercase text-sm shrink-0 overflow-hidden">
                  {item.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-[#1e2327] dark:text-[var(--text-title)] font-['Montserrat',sans-serif]">
                    {item.name}
                  </p>
                  <p className="text-[12px] font-medium text-neutral-500 dark:text-[var(--text-dim)] mt-0.5 tracking-wide">
                    {t(`testimonials.items.${item.id}.designation`)}, {item.company}
                  </p>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};