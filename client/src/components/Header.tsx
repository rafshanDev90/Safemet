import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafemeteLogo } from './SafemeteLogo';
import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { CATEGORIES, CategoryInfo } from '../productsData';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  activeTab?: string;
  activeCategory?: string;
  onNavigate?: (route: string) => void;
  forceDropdownOpen?: boolean;
}

export const MEDIA_CATEGORIES = [
  'PICTURE GALLERY',
  'VIDEO GALLERY',
  'CATALOGUE',
];

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'products',
  activeCategory,
  onNavigate,
  forceDropdownOpen = false,
}) => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const activeDropdown = hoveredMenu ?? (forceDropdownOpen ? 'products' : null);

  const mediaCategories = t('header.mediaCategories', { returnObjects: true }) as string[];

  const navItems = [
    { label: t('header.home'), id: 'home', path: '/' },
    { label: t('header.about'), id: 'about', path: '/about' },
    { label: t('header.products'), id: 'products', path: '/products/fire-protection-system', hasDropdown: true },
    { label: t('header.projects'), id: 'projects', path: '/projects' },
    { label: t('header.media'), id: 'media', path: '/media', hasDropdown: true },
    { label: t('header.contact'), id: 'contact', path: '/contact' },
  ];

  const handleNavClick = (pathOrId: string) => {
    setMobileOpen(false);
    setHoveredMenu(null);
    if (onNavigate) {
      onNavigate(pathOrId);
    }
  };

  const handleCategorySelect = (category: CategoryInfo) => {
    setMobileOpen(false);
    setHoveredMenu(null);
    if (onNavigate) {
      onNavigate(category.path);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg font-['Montserrat',sans-serif]" id="main-header">
      {/* Top Red Accent Bar */}
      <div className="w-full h-[3px] bg-[#E5252B]" />

      {/* Main Navigation Bar */}
      <div className="w-full bg-[#202528] text-white border-b border-[#2d3338]">
        <Container className="h-[84px] flex items-center justify-between">
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')} className="cursor-pointer">
            <SafemeteLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 text-[14px] font-bold tracking-wider relative h-full">
            {navItems.map((item) => {
              const isDropdownItem = item.hasDropdown;
              const isDropdownActive = activeDropdown === item.id;
              const isDirectActive = activeTab.toLowerCase() === item.id.toLowerCase();
              const isHighlighted = isDropdownActive || (!activeDropdown && isDirectActive);

              if (item.id === 'products') {
                return (
                  <div
                    key={item.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setHoveredMenu('products')}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <button
                      id={`nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`transition-colors duration-200 uppercase py-1 cursor-pointer flex items-center gap-1 ${
                        isHighlighted
                          ? 'text-[#E5252B]'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>

                    {/* PRODUCTS DROPDOWN MENU */}
                    {isDropdownActive && (
                      <div
                        id="products-dropdown-menu"
                        className="absolute top-[84px] left-0 w-[270px] sm:w-[290px] bg-white dark:bg-[#1a1d23] text-[#202528] dark:text-[#e0e3e7] shadow-2xl z-50 border border-neutral-200/80 dark:border-[#2a2f37] border-t-0 animate-fadeIn"
                      >
                        <div className="flex flex-col">
                          {CATEGORIES.map((cat, idx) => {
                            const isCurrentCat = activeCategory === cat.slug;
                            return (
                              <div key={cat.slug} className="flex flex-col">
                                <button
                                  id={`dropdown-cat-${cat.slug}`}
                                  onClick={() => handleCategorySelect(cat)}
                                  className={`w-full text-left px-6 py-4 text-[13px] sm:text-[14px] font-extrabold tracking-wider uppercase transition-colors cursor-pointer ${
                                    isCurrentCat
                                      ? 'text-[#E5252B] bg-neutral-50 dark:bg-[#23272e]'
                                      : 'text-[#1e2327] dark:text-[#e0e3e7] hover:bg-neutral-50 dark:hover:bg-[#23272e] hover:text-[#E5252B]'
                                  }`}
                                >
                                  {t(`categories.${cat.slug}.name`)}
                                </button>
                                {idx < CATEGORIES.length - 1 && (
                                  <div className="w-full h-[1px] bg-neutral-200/80 dark:bg-[#2a2f37]" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Thin Red Accent Bar at bottom edge of dropdown panel */}
                        <div className="w-full h-[3px] bg-[#E5252B]" />
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'media') {
                return (
                  <div
                    key={item.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setHoveredMenu('media')}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <button
                      id={`nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`transition-colors duration-200 uppercase py-1 cursor-pointer flex items-center gap-1 ${
                        isHighlighted
                          ? 'text-[#E5252B]'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>

                    {/* MEDIA DROPDOWN MENU: EXACT SPECIFICATION */}
                    {isDropdownActive && (
                      <div
                        id="media-dropdown-menu"
                        className="absolute top-[84px] left-0 w-[220px] sm:w-[240px] bg-white dark:bg-[#1a1d23] text-[#202528] dark:text-[#e0e3e7] shadow-2xl z-50 border border-neutral-200/80 dark:border-[#2a2f37] border-t-0 animate-fadeIn"
                      >
                        <div className="flex flex-col">
                          {mediaCategories.map((cat, idx) => (
                            <div key={cat} className="flex flex-col">
                              <button
                                onClick={() => handleNavClick('projects')}
                                className="w-full text-left px-6 py-4 text-[13px] sm:text-[14px] font-extrabold tracking-wider uppercase text-[#1e2327] dark:text-[#e0e3e7] hover:bg-neutral-50 dark:hover:bg-[#23272e] hover:text-[#E5252B] transition-colors cursor-pointer"
                              >
                                {cat}
                              </button>
                              {idx < mediaCategories.length - 1 && (
                                <div className="w-full h-[1px] bg-neutral-200/80 dark:bg-[#2a2f37]" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Thin Red Accent Bar at bottom edge of dropdown panel */}
                        <div className="w-full h-[3px] bg-[#E5252B]" />
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors duration-200 uppercase py-1 cursor-pointer relative ${
                    isHighlighted
                      ? 'text-[#E5252B]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isHighlighted && !activeDropdown && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E5252B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right cluster: language + theme toggle + mobile hamburger */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            <LanguageToggle />

            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white focus:outline-none cursor-pointer rounded-sm"
              aria-label={mobileOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#E5252B]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </Container>

        {/* Mobile Dropdown Menu with Accordions */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#1a1e21] border-t border-neutral-800 px-4 sm:px-6 py-4 space-y-1.5 shadow-2xl animate-fadeIn">
            {navItems.map((item) => {
              if (item.id === 'products') {
                return (
                  <div key={item.id} className="border-b border-neutral-800/80 pb-1">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="flex-1 min-h-[44px] flex items-center text-left text-sm font-bold uppercase tracking-wider text-neutral-200 hover:text-[#E5252B] transition-colors"
                      >
                        {item.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileProductsOpen(!mobileProductsOpen);
                        }}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label={t('header.toggleProductsSub')}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileProductsOpen ? 'rotate-180 text-[#E5252B]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Products Collapsible Accordion Submenu */}
                    {mobileProductsOpen && (
                      <div className="pl-3 pr-1 pb-2 pt-1 space-y-1 border-l-2 border-[#E5252B] ml-2 animate-fadeIn bg-black/20 rounded-r">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => handleCategorySelect(cat)}
                            className={`min-h-[40px] flex items-center w-full text-left px-3 py-2 text-[13px] font-bold uppercase tracking-wider transition-colors rounded ${
                              activeCategory === cat.slug
                                ? 'text-[#E5252B] bg-[#22272a]'
                                : 'text-neutral-300 hover:text-white hover:bg-[#22272a]'
                            }`}
                          >
                            {t(`categories.${cat.slug}.name`)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'media') {
                return (
                  <div key={item.id} className="border-b border-neutral-800/80 pb-1">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="flex-1 min-h-[44px] flex items-center text-left text-sm font-bold uppercase tracking-wider text-neutral-200 hover:text-[#E5252B] transition-colors"
                      >
                        {item.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileMediaOpen(!mobileMediaOpen);
                        }}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label={t('header.toggleMediaSub')}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileMediaOpen ? 'rotate-180 text-[#E5252B]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Media Collapsible Accordion Submenu */}
                    {mobileMediaOpen && (
                      <div className="pl-3 pr-1 pb-2 pt-1 space-y-1 border-l-2 border-[#E5252B] ml-2 animate-fadeIn bg-black/20 rounded-r">
                        {mediaCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleNavClick('projects')}
                            className="min-h-[40px] flex items-center w-full text-left px-3 py-2 text-[13px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-[#22272a] rounded transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.id} className="border-b border-neutral-800/80 last:border-b-0">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="w-full min-h-[44px] flex items-center text-left text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-[#E5252B] transition-colors"
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}

            {/* Mobile Menu Direct Contact CTA Buttons */}
            <div className="pt-4 mt-2 border-t border-neutral-700/80 flex flex-col gap-2">
              <a
                href="tel:+08007777777"
                className="min-h-[44px] flex items-center justify-center gap-2 bg-[#252a2e] hover:bg-[#E5252B] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E5252B] group-hover:text-white" />
                <span>{t('header.callUs')}</span>
              </a>
              <a
                href="mailto:mktg980@safemete.com"
                className="min-h-[44px] flex items-center justify-center gap-2 bg-[#252a2e] hover:bg-neutral-700 text-neutral-300 text-sm tracking-wide rounded-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>mktg980@safemete.com</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
