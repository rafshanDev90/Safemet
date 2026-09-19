import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { Container } from './Container';
import { Reveal } from './Reveal';

interface ProductsSectionProps {
  onSelectProduct?: (product: { id: string; title: string; image: string; description?: string; category?: string }) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onSelectProduct }) => {
  const { t } = useTranslation();
  const [activeModalProduct, setActiveModalProduct] = useState<{ id: string; title: string; image: string; description?: string; category?: string } | null>(null);
  const { products, loading } = useProducts();

  // Take the first 4 live products for the homepage carousel
  const PRODUCTS = products.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.name,
    image: p.image || '',
    description: p.description,
    category: p.category,
  }));

  const handleProductClick = (product: { id: string; title: string; image: string; description?: string; category?: string }) => {
    setActiveModalProduct(product);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <section id="products" className="w-full bg-white dark:bg-[var(--bg-primary)] py-16 md:py-24">
      <Container>
        {/* Section Header with Left Line Title and Right Arrows */}
        <Reveal>
          <div className="flex items-center justify-between pb-8 mb-12 border-b border-neutral-200 dark:border-[var(--border-default)]">
            <div className="flex items-center gap-4">
              <div className="w-8 md:w-12 h-[2.5px] bg-[#222629] dark:bg-[var(--text-muted)]" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] dark:text-[var(--text-heading)] tracking-wider uppercase font-['Montserrat',sans-serif]">
                {t('products.title')}
              </h2>
            </div>

            {/* Carousel Arrows */}
            <div className="flex items-center space-x-2 text-neutral-700 dark:text-[var(--text-muted)]">
              <button
                className="w-12 h-12 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-[var(--bg-hover)] hover:text-[#E5252B] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none cursor-pointer"
                aria-label={t('products.prev')}
              >
                <ChevronLeft className="w-7 h-7 stroke-[2.5] transition-transform duration-300 hover:scale-110" />
              </button>
              <button
                className="w-12 h-12 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-[var(--bg-hover)] hover:text-[#E5252B] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none cursor-pointer"
                aria-label={t('products.next')}
              >
                <ChevronRight className="w-7 h-7 stroke-[2.5] transition-transform duration-300 hover:scale-110" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Product Cards Grid (1-col on mobile, 2-cols on tablet, 4-cols on desktop) */}
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-neutral-400 uppercase tracking-wider animate-fadeIn">
            {t('products.loading')}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {PRODUCTS.map((prod, idx) => (
            <Reveal key={prod.id} delay={idx * 0.07}>
              <div
                id={`product-card-${prod.id}`}
                onClick={() => handleProductClick(prod)}
                className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Maroon Product Box */}
                <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-[#780606] border border-[#600505] shadow-md group-hover:shadow-xl transition-all duration-300 flex items-center justify-center p-3">
                  {/* Product Image */}
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-[#E5252B] text-white text-[13px] font-bold uppercase tracking-wider px-4 py-1.5 rounded shadow-md">
                      {t('products.viewSpecs')}
                    </span>
                  </div>
                </div>

                {/* Product Title Below */}
                <div className="mt-5 text-center">
                  <h3 className="text-sm sm:text-[15px] font-extrabold uppercase tracking-wider text-[#1e2327] dark:text-[var(--text-title)] group-hover:text-[#E5252B] transition-colors duration-300 line-clamp-2 px-1">
                    {prod.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        )}
      </Container>

      {/* Product Quick Specs Modal */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            className="bg-white dark:bg-[var(--bg-card)] rounded-md max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-[var(--border-default)] animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#780606] p-5 sm:p-6 flex justify-center items-center relative">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.title}
                referrerPolicy="no-referrer"
                className="max-h-56 sm:max-h-72 object-contain"
              />
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/40 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition-colors cursor-pointer"
                aria-label={t('products.closeModal')}
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1e2327] dark:text-[var(--text-title)] uppercase tracking-wide mb-2">
                {activeModalProduct.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-[var(--text-muted)] mb-6 leading-relaxed">
                {activeModalProduct.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-neutral-100 dark:border-[var(--border-soft)]">
                <span className="text-[13px] sm:text-sm text-neutral-500 dark:text-[var(--text-dim)] font-semibold">{t('products.ulFm')}</span>
                <a
                  href="#contact"
                  onClick={() => setActiveModalProduct(null)}
                  className="bg-[#E5252B] hover:bg-[#c41e23] text-white text-sm font-bold px-7 py-3.5 rounded-none uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-h-[44px]"
                >
                  {t('products.requestQuote')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
