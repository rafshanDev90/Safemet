import React from 'react';
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
  const { getByCategory, loading } = useProducts();
  const categoryInfo = getCategoryBySlug(categorySlug);
  const products = getByCategory(categorySlug);

  // If unknown category, or still loading/empty, show a friendly fallback
  if (!categoryInfo || (loading ? false : products.length === 0)) {
    return (
      <div className="w-full bg-white font-['Montserrat',sans-serif]" id="category-not-found-page">
        {/* Hero Banner with standard PRODUCTS title */}
        <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1a1f24] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#121619] via-[#1a1f24] to-[#121619]" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-widest uppercase">
              PRODUCTS
            </h1>
            <div className="w-24 sm:w-32 h-[3px] bg-[#E5252B] mx-auto mt-3 sm:mt-4" />
          </div>
        </section>

        {/* Breadcrumb Path */}
        <div className="w-full bg-[#f4f5f7] border-b border-neutral-200 py-3.5 sm:py-4 px-4">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center text-[13px] sm:text-sm font-bold tracking-wider text-neutral-500 uppercase">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#E5252B] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-400" />
            <span className="text-[#E5252B]">PRODUCTS</span>
          </div>
        </div>

        {/* Empty State / Not Found Notice */}
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5 text-neutral-400">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202528] uppercase tracking-wide">
            No Products Found
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            The category <span className="font-bold text-neutral-800">"{categorySlug}"</span> does not exist or has no active products listed.
          </p>

          {/* Quick links to available categories */}
          <div className="mt-8">
            <h3 className="text-[13px] sm:text-sm font-bold tracking-widest text-neutral-400 uppercase mb-4">
              Explore Our Product Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="p-5 border border-neutral-200 hover:border-[#E5252B] rounded bg-white hover:bg-neutral-50 transition-all group flex items-center justify-between text-left"
                >
                  <span className="text-[13px] sm:text-sm font-bold text-[#202528] group-hover:text-[#E5252B] transition-colors uppercase">
                    {cat.name}
                  </span>
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#E5252B] transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display Name e.g. "FIRE PROTECTION SYSTEM"
  const categoryDisplayName = categoryInfo.displayName;

  return (
    <div className="w-full bg-white font-['Montserrat',sans-serif]" id="category-products-page">
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
            PRODUCTS
          </h1>
          {/* Thin Red Underline Accent */}
          <div className="w-24 sm:w-32 h-[3px] bg-[#E5252B] mx-auto mt-3 sm:mt-4" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION BAR: HOME → [Category Display Name] */}
      <div
        className="w-full bg-[#f4f5f7] border-b border-neutral-200 py-3.5 sm:py-4"
        id="category-breadcrumbs"
      >
        <Container className="flex items-center justify-center text-[13px] sm:text-sm font-bold tracking-wider text-neutral-500 uppercase">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#E5252B] transition-colors cursor-pointer"
          >
            HOME
          </button>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-neutral-400" />
          <span className="text-[#E5252B] font-extrabold">{categoryDisplayName}</span>
        </Container>
      </div>

      {/* 3. CATEGORY SWITCHER PILLS (Convenient quick switching across the 5 categories) */}
      <div className="w-full bg-white border-b border-neutral-100 py-3">
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
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </Container>
      </div>

      {/* 4. NUMBERED 3-COLUMN PRODUCT GRID */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <Container>
          {loading ? (
            <div className="py-20 text-center text-sm font-semibold text-neutral-400 uppercase tracking-wider">
              Loading products...
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
