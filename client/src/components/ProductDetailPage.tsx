import React, { useState } from 'react';
import { ASSETS } from '../data';
import { ChevronRight, ChevronDown, ChevronUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, ProductItem } from '../productsData';
import { useProducts } from '../ProductContext';
import { Container } from './Container';

interface ProductDetailPageProps {
  productSlug?: string;
  onNavigateHome?: () => void;
  onNavigateCategory?: (categorySlug: string) => void;
  onSelectProduct?: (productSlug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productSlug = 'abce-dry-powder-3kg',
  onNavigateHome,
  onNavigateCategory,
  onSelectProduct,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const { products, getBySlug, getByCategory, loading } = useProducts();

  // Look up the product by slug
  const product = getBySlug(productSlug) || products[0];
  const categoryInfo = product ? getCategoryBySlug(product.category) : undefined;

  // Get other products in the same category for "RELATED PRODUCTS"
  const relatedProducts = product
    ? getByCategory(product.category)
        .filter((p) => p.slug !== product.slug)
        .slice(0, 3)
    : [];

  // Show a loading state while the catalog is being fetched
  if (loading && !product) {
    return (
      <div className="w-full bg-white font-['Montserrat',sans-serif]">
        <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">PRODUCT</h1>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-sm font-semibold text-neutral-400 uppercase tracking-wider">
          Loading product details...
        </div>
      </div>
    );
  }

  // Fallback if product truly doesn't exist
  if (!product) {
    return (
      <div className="w-full bg-white font-['Montserrat',sans-serif]" id="product-not-found">
        <section className="relative w-full h-[280px] sm:h-[350px] lg:h-[450px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">PRODUCT</h1>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a1e21] uppercase mb-2">Product Not Found</h2>
          <p className="text-neutral-500 text-sm mb-6">The requested product could not be located in our catalog.</p>
          <button
            onClick={() => onNavigateCategory && onNavigateCategory('fire-protection-system')}
            className="px-6 py-3 bg-[#E5252B] text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-[#c81e1e] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const renderProductGraphic = (item: ProductItem) => {
    if (item.image) {
      return (
        <img
          src={item.image}
          alt={item.name}
          className="max-h-[360px] sm:max-h-[440px] w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
        />
      );
    }
    return (
      <div className="w-64 h-64 bg-neutral-100 rounded flex items-center justify-center text-neutral-400">
        <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white font-['Montserrat',sans-serif]" id="product-detail-page">
      {/* 1. HERO BREADCRUMB BANNER (Night City Skyline) */}
      <section
        className="relative w-full h-[320px] sm:h-[400px] lg:h-[500px] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${ASSETS.nightCitySkyline})`,
          backgroundPosition: 'center 40%',
        }}
      >
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-[#0f1620]/65 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-widest text-white uppercase drop-shadow-md">
            PRODUCT
          </h1>
          {/* Thin horizontal underline below PRODUCT */}
          <div className="w-20 h-[2px] bg-white/90 mx-auto mt-4" />
        </div>
      </section>

      {/* 2. BREADCRUMB BAR */}
      <div className="w-full bg-[#f2f2f2] border-b border-neutral-200 py-3.5 sm:py-4">
        <Container className="flex flex-wrap items-center justify-center text-[13px] sm:text-sm font-semibold text-neutral-600 tracking-wider uppercase text-center gap-y-1">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#E5252B] transition-colors cursor-pointer"
          >
            HOME
          </button>
          <span className="mx-2 text-neutral-400 font-normal">→</span>
          <button
            onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
            className="hover:text-[#E5252B] transition-colors cursor-pointer"
          >
            {categoryInfo?.displayName || 'PRODUCTS'}
          </button>
          <span className="mx-2 text-neutral-400 font-normal">→</span>
          <span className="text-[#1a1a1a] font-bold">
            {product.name.toUpperCase()}
          </span>
        </Container>
      </div>

      {/* 3. MAIN PRODUCT DETAILS SECTION */}
      <section className="w-full pt-10 sm:pt-14 pb-16 sm:pb-24">
        <Container>
          {/* Two-Column Product Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Product Image on White Background */}
            <div className="lg:col-span-5 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
              {renderProductGraphic(product)}
            </div>

            {/* Right Column: Title, Category, Specification List */}
            <div className="lg:col-span-7 flex flex-col justify-start pt-1 sm:pt-4">
              {/* Product Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#1a1e21] tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Category */}
              <div className="text-sm sm:text-[15px] text-neutral-600 mb-8 font-medium">
                <span className="font-normal text-neutral-700">Category: </span>
                <button
                  onClick={() => onNavigateCategory && onNavigateCategory(product.category)}
                  className="uppercase text-[#202528] font-bold hover:text-[#E5252B] transition-colors cursor-pointer"
                >
                  {categoryInfo?.name || product.category.replace(/-/g, ' ')}
                </button>
              </div>

              {/* Specifications Key-Value List */}
              {product.specs && product.specs.length > 0 && (
                <div className="space-y-1.5 text-[15px] sm:text-base text-[#2c3236]">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="leading-relaxed">
                      <span className="font-semibold text-[#1e2327]">
                        {spec.label}:{' '}
                      </span>
                      <span className="text-neutral-700 font-normal">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* 4. ADDITIONAL INFORMATION ACCORDION BOX */}
        {product.description && (
          <div className="mt-14 w-full">
            {/* Bordered Accordion Header Box */}
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full text-left border border-neutral-300/80 bg-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 transition-colors"
            >
              <span className="text-[14px] sm:text-[15px] font-extrabold tracking-wider uppercase text-[#E5252B]">
                ADDITIONAL INFORMATION
              </span>
              <span className="text-neutral-400">
                {accordionOpen ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </span>
            </button>

            {/* Accordion Content */}
            {accordionOpen && (
              <div className="pt-5 pb-2 px-1 text-[15px] sm:text-base leading-relaxed text-[#444a50]">
                <p>{product.description}</p>
              </div>
            )}
          </div>
        )}

        {/* 5. RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-10 border-t border-neutral-200/70">
            <h3 className="text-center text-2xl sm:text-3xl font-black uppercase text-[#1a1e21] tracking-wider mb-12">
              RELATED PRODUCTS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-[1080px] mx-auto">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod.slug)}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  {/* Product Card Image Container */}
                  <div className="w-full h-[320px] sm:h-[360px] flex items-center justify-center p-6 bg-white transition-all duration-300">
                    <img
                      src={prod.image || ASSETS.electricPump}
                      alt={prod.name}
                      className="max-h-[260px] sm:max-h-[300px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Title */}
                  <h4 className="mt-4 text-center text-base sm:text-lg font-bold text-[#1f2428] group-hover:text-[#E5252B] transition-colors">
                    {prod.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
        </Container>
      </section>
    </div>
  );
};
