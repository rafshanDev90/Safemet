import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/ProductsSection';
import { AdvantagesSection } from './components/AdvantagesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { PartnersSection } from './components/PartnersSection';
import { QuoteSection } from './components/QuoteSection';
import { AboutSeoSection } from './components/AboutSeoSection';
import { AboutPage } from './components/AboutPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryProductsPage } from './components/CategoryProductsPage';
import { Footer } from './components/Footer';
import { CATEGORIES } from './productsData';

type ViewMode = 'home' | 'about' | 'projects' | 'contact' | 'category' | 'product-detail';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('category');
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('fire-protection-system');
  const [activeProductSlug, setActiveProductSlug] = useState<string>('fire-door');

  // Parse path on initial mount and browser back/forward (popstate)
  const syncRouteFromLocation = () => {
    const path = window.location.pathname;

    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '').split('/')[0];
      setCurrentView('category');
      setActiveCategorySlug(slug || 'fire-protection-system');
    } else if (path === '/products') {
      setCurrentView('category');
      setActiveCategorySlug('fire-protection-system');
    } else if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('/')[0];
      setCurrentView('product-detail');
      setActiveProductSlug(slug || 'abce-dry-powder-3kg');
    } else if (path === '/about' || path === '/about-us') {
      setCurrentView('about');
    } else if (path === '/projects') {
      setCurrentView('projects');
    } else if (path === '/contact' || path === '/contact-us') {
      setCurrentView('contact');
    } else if (path === '/' || path === '/home') {
      // Default to category view if opened with root or direct navigation
      // but if user intentionally clicked home, stay home
    }
  };

  useEffect(() => {
    syncRouteFromLocation();

    const handlePopState = () => {
      syncRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (pathOrId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Direct Category Route (e.g. /products/fire-suppression-system)
    if (pathOrId.startsWith('/products/')) {
      const categorySlug = pathOrId.replace('/products/', '');
      setActiveCategorySlug(categorySlug);
      setCurrentView('category');
      try {
        window.history.pushState(null, '', pathOrId);
      } catch (_) {}
      return;
    }

    // 2. Direct Product Detail Route (e.g. /product/abce-dry-powder-3kg)
    if (pathOrId.startsWith('/product/')) {
      const slug = pathOrId.replace('/product/', '');
      setActiveProductSlug(slug);
      setCurrentView('product-detail');
      try {
        window.history.pushState(null, '', pathOrId);
      } catch (_) {}
      return;
    }

    // 3. Category slug string without prefix
    if (CATEGORIES.some((c) => c.slug === pathOrId)) {
      setActiveCategorySlug(pathOrId);
      setCurrentView('category');
      try {
        window.history.pushState(null, '', `/products/${pathOrId}`);
      } catch (_) {}
      return;
    }

    // 4. Products root
    if (pathOrId === 'products' || pathOrId === '/products') {
      setCurrentView('category');
      setActiveCategorySlug('fire-protection-system');
      try {
        window.history.pushState(null, '', '/products/fire-protection-system');
      } catch (_) {}
      return;
    }

    // 5. Standard Static Pages
    if (pathOrId === 'home' || pathOrId === '/') {
      setCurrentView('home');
      try {
        window.history.pushState(null, '', '/');
      } catch (_) {}
      return;
    }

    if (pathOrId === 'about' || pathOrId === '/about') {
      setCurrentView('about');
      try {
        window.history.pushState(null, '', '/about');
      } catch (_) {}
      return;
    }

    if (pathOrId === 'projects' || pathOrId === '/projects') {
      setCurrentView('projects');
      try {
        window.history.pushState(null, '', '/projects');
      } catch (_) {}
      return;
    }

    if (pathOrId === 'contact' || pathOrId === '/contact') {
      setCurrentView('contact');
      try {
        window.history.pushState(null, '', '/contact');
      } catch (_) {}
      return;
    }

    // 6. Anchor links or scroll targets
    if (currentView !== 'home') {
      setCurrentView('home');
      try {
        window.history.pushState(null, '', '/');
      } catch (_) {}
      setTimeout(() => {
        const targetElement = document.getElementById(pathOrId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const targetElement = document.getElementById(pathOrId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333333] font-['Montserrat',sans-serif] selection:bg-[#E5252B] selection:text-white">
      {/* Main Navigation Header */}
      <Header
        activeTab={
          currentView === 'category' || currentView === 'product-detail'
            ? 'products'
            : currentView
        }
        activeCategory={activeCategorySlug}
        onNavigate={navigateTo}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'category' ? (
          /* Dynamic Category Product Catalog Page (/products/[category]) */
          <CategoryProductsPage
            categorySlug={activeCategorySlug}
            onNavigateHome={() => navigateTo('/')}
            onSelectCategory={(slug) => navigateTo(`/products/${slug}`)}
            onSelectProduct={(productSlug) => navigateTo(`/product/${productSlug}`)}
          />
        ) : currentView === 'product-detail' ? (
          /* Dynamic Product Detail Page (/product/[slug]) */
          <ProductDetailPage
            productSlug={activeProductSlug}
            onNavigateHome={() => navigateTo('/')}
            onNavigateCategory={(catSlug) => navigateTo(`/products/${catSlug}`)}
            onSelectProduct={(productSlug) => navigateTo(`/product/${productSlug}`)}
          />
        ) : currentView === 'contact' ? (
          /* Contact Us Page */
          <ContactPage onNavigateHome={() => navigateTo('/')} />
        ) : currentView === 'projects' ? (
          /* Projects Gallery Page */
          <ProjectsPage onNavigateHome={() => navigateTo('/')} />
        ) : currentView === 'about' ? (
          /* About Us Corporate Page */
          <AboutPage onNavigateHome={() => navigateTo('/')} />
        ) : (
          /* Home Page Experience */
          <>
            <Hero />
            <ProductsSection />
            <AdvantagesSection />
            <ProjectsSection />
            <ServicesSection />
            <PartnersSection />
            <QuoteSection />
            <AboutSeoSection />
          </>
        )}
      </main>

      {/* Corporate Footer with Navigation Links */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
