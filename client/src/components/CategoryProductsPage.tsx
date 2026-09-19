import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Flame, Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { CATEGORIES, getCategoryBySlug, CategoryInfo } from '../productsData';
import { useProducts } from '../ProductContext';
import { ProductCategoryGrid } from './ProductCategoryGrid';
import { Container } from './Container';

interface CategoryProductsPageProps {
  categorySlug: string;
  onNavigateHome: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectProduct: (productSlug: string) => void;
}

export const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({
  categorySlug,
  onNavigateHome,
  onSelectCategory,
  onSelectProduct,
}) => {
  const { t } = useTranslation();
  const { getByCategory, loading } = useProducts();
  const categoryInfo = getCategoryBySlug(categorySlug);
  const products = getByCategory(categorySlug);

  // If unknown category, or still loading/empty, show a friendly fallback
  if (!categoryInfo || (loading ? false : products.length === 0)) {
    return (
      <div className="w-full bg-white dark:bg-[var(--bg-primary)] font-['Montserrat',sans-serif]" id="category-not-found-page">
        {/* Hero Banner with standard PRODUCTS title */}
        <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1a1f24] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#121619] via-[#1a1f24] to-[#121619]" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-widest uppercase">
              {t('categoryProducts.title')}
            </h1>
            <div className="w-24 sm:w-32 h-[3px] bg-[#E5252B] mx-auto mt-3 sm:mt-4" />
          </div>
        </section>

        {/* Breadcrumb Path */}
        <div className="w-full bg-[#f4f5f7] dark:bg-[var(--bg-quinary)] border-b border-neutral-200 dark:border-[var(--border-default)] py-3.5 sm:py-4 px-4">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center text-[13px] sm:text-sm font-bold tracking-wider text-neutral-500 dark:text-[var(--text-dim)] uppercase">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#E5252B] transition-colors cursor-pointer"
            >
              {t('categoryProducts.breadcrumb')}
            </button>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-400 dark:text-[var(--text-dim)]" />
            <span className="text-[#E5252B]">{t('categoryProducts.title')}</span>
          </div>
        </div>

        {/* Empty State / Not Found Notice */}
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-5 text-neutral-400 dark:text-[var(--text-dim)]">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202528] dark:text-[var(--text-slate)] uppercase tracking-wide">
            {t('categoryProducts.notFoundTitle')}
          </h2>
          <p className="text-neutral-500 dark:text-[var(--text-muted)] text-sm sm:text-base mt-2 max-w-md mx-auto">
            {t('categoryProducts.notFoundBody', { slug: categorySlug })}
          </p>

          {/* Quick links to available categories */}
          <div className="mt-8">
            <h3 className="text-[13px] sm:text-sm font-bold tracking-widest text-neutral-400 dark:text-[var(--text-dim)] uppercase mb-4">
              {t('categoryProducts.exploreTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="p-5 border border-neutral-200 dark:border-[var(--border-default)] hover:border-[#E5252B] rounded bg-white dark:bg-[var(--bg-card)] hover:bg-neutral-50 dark:hover:bg-[var(--bg-hover)] transition-all group flex items-center justify-between text-left"
                >
                  <span className="text-[13px] sm:text-sm font-bold text-[#202528] dark:text-[var(--text-slate)] group-hover:text-[#E5252B] transition-colors uppercase">
                    {t(`categories.${cat.slug}.name`)}
                  </span>
                  <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-[var(--text-dim)] group-hover:text-[#E5252B] transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display Name e.g. "FIRE PROTECTION SYSTEM"
  const categoryDisplayName = t(`categories.${categoryInfo.slug}.displayName`);

  return (
    <div className="w-full bg-white dark:bg-[var(--bg-primary)] font-['Montserrat',sans-serif]" id="category-products-page">
      {/* 1. HERO BANNER: Warm flame & hexagon pattern with PRODUCTS heading */}
      <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1a1f24] overflow-hidden flex items-center justify-center">
        {/* Background Composite Layers: Left fiery amber glow, Right hexagon mechanical motif */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0800] via-[#1c1c1f] to-[#0a1118]" />

        {/* Subtle Fire / Heat Amber Gradient Flare on Left */}
        <div className="absolute -left-20 top-0 bottom-0 w-[500px] bg-gradient-to-r from-[#d9480f]/35 via-[#b02a1a]/20 to-transparent blur-3xl pointer-events-none" />

        {/* Geometric Hexagonal Mesh Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #1a1f24 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* Ambient Darkened Backdrop Filter for High Contrast Title */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Centered Heading */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-widest uppercase drop-shadow-sm">
            {t('categoryProducts.title')}
          </h1>
          {/* Thin Red Underline Accent */}
          <div className="w-24 sm:w-32 h-[3px] bg-[#E5252B] mx-auto mt-3 sm:mt-4" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION BAR: HOME → [Category Display Name] */}
      <div
        className="w-full bg-[#f4f5f7] dark:bg-[var(--bg-quinary)] border-b border-neutral-200 dark:border-[var(--border-default)] py-3.5 sm:py-4"
        id="category-breadcrumbs"
      >
        <Container className="flex items-center justify-center text-[13px] sm:text-sm font-bold tracking-wider text-neutral-500 dark:text-[var(--text-dim)] uppercase">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#E5252B] transition-colors cursor-pointer"
          >
            {t('categoryProducts.breadcrumb')}
          </button>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-400 dark:text-[var(--text-dim)]" />
          <span className="text-[#E5252B] font-extrabold">{categoryDisplayName}</span>
        </Container>
      </div>

      {/* 3. CATEGORY SWITCHER PILLS (Convenient quick switching across the 5 categories) */}
      <div className="w-full bg-white dark:bg-[var(--bg-primary)] border-b border-neutral-100 dark:border-[var(--border-soft)] py-3">
        <Container className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = cat.slug === categorySlug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-sm text-[13px] font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#E5252B] text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-[var(--bg-hover)] text-neutral-600 dark:text-[var(--text-muted)] hover:bg-neutral-200 dark:hover:bg-[var(--bg-chip)] hover:text-neutral-900 dark:hover:text-[var(--text-title)]'
                }`}
              >
                {t(`categories.${cat.slug}.name`)}
              </button>
            );
          })}
        </Container>
      </div>

      {/* 4. NUMBERED 3-COLUMN PRODUCT GRID */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <Container>
          {loading ? (
            <div className="py-20 text-center text-sm font-semibold text-neutral-400 dark:text-[var(--text-dim)] uppercase tracking-wider">
              {t('categoryProducts.loading')}
            </div>
          ) : (
            <ProductCategoryGrid
              products={products}
              onSelectProduct={onSelectProduct}
            />
          )}
        </Container>
      </main>
    </div>
  );
};
