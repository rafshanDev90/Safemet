import React, { useState } from 'react';
import { SafemeteLogo } from './SafemeteLogo';
import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { CATEGORIES, CategoryInfo } from '../productsData';
import { Container } from './Container';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const activeDropdown = hoveredMenu ?? (forceDropdownOpen ? 'products' : null);

  const navItems = [
    { label: 'HOME', id: 'home', path: '/' },
    { label: 'ABOUT US', id: 'about', path: '/about' },
    { label: 'PRODUCTS', id: 'products', path: '/products/fire-protection-system', hasDropdown: true },
    { label: 'PROJECTS', id: 'projects', path: '/projects' },
    { label: 'MEDIA', id: 'media', path: '/media', hasDropdown: true },
    { label: 'CONTACT US', id: 'contact', path: '/contact' },
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
        <Container className="h-[68px] flex items-center justify-between">
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')} className="cursor-pointer">
            <SafemeteLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[12px] font-bold tracking-wider relative h-full">
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
                        className="absolute top-[68px] left-0 w-[270px] sm:w-[290px] bg-white text-[#202528] shadow-2xl z-50 border border-neutral-200/80 border-t-0 animate-fadeIn"
                      >
                        <div className="flex flex-col">
                          {CATEGORIES.map((cat, idx) => {
                            const isCurrentCat = activeCategory === cat.slug;
                            return (
                              <div key={cat.slug} className="flex flex-col">
                                <button
                                  id={`dropdown-cat-${cat.slug}`}
                                  onClick={() => handleCategorySelect(cat)}
                                  className={`w-full text-left px-5 py-3 text-[11px] sm:text-[12px] font-extrabold tracking-wider uppercase transition-colors cursor-pointer ${
                                    isCurrentCat
                                      ? 'text-[#E5252B] bg-neutral-50'
                                      : 'text-[#1e2327] hover:bg-neutral-50 hover:text-[#E5252B]'
                                  }`}
                                >
                                  {cat.name}
                                </button>
                                {idx < CATEGORIES.length - 1 && (
                                  <div className="w-full h-[1px] bg-neutral-200/80" />
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
                        className="absolute top-[68px] left-0 w-[220px] sm:w-[240px] bg-white text-[#202528] shadow-2xl z-50 border border-neutral-200/80 border-t-0 animate-fadeIn"
                      >
                        <div className="flex flex-col">
                          {MEDIA_CATEGORIES.map((cat, idx) => (
                            <div key={cat} className="flex flex-col">
                              <button
                                onClick={() => handleNavClick('projects')}
                                className="w-full text-left px-5 py-3 text-[11px] sm:text-[12px] font-extrabold tracking-wider uppercase text-[#1e2327] hover:bg-neutral-50 hover:text-[#E5252B] transition-colors cursor-pointer"
                              >
                                {cat}
                              </button>
                              {idx < MEDIA_CATEGORIES.length - 1 && (
                                <div className="w-full h-[1px] bg-neutral-200/80" />
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

          {/* Contact Numbers on Right */}
          <div className="hidden md:flex flex-col items-end text-right font-['Montserrat',sans-serif]">
            <a
              href="tel:+08007777777"
              className="text-white font-bold text-sm tracking-wide hover:text-[#E5252B] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5252B]" />
              <span>+0800-7777777</span>
            </a>
            <a
              href="mailto:mktg980@prangroup.com"
              className="text-[#9ca3af] text-[11px] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3 text-neutral-400" />
              <span>mktg980@prangroup.com</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white focus:outline-none cursor-pointer rounded-sm"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6 text-[#E5252B]" /> : <Menu className="w-6 h-6" />}
          </button>
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
                        className="flex-1 min-h-[44px] flex items-center text-left text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-[#E5252B] transition-colors"
                      >
                        {item.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileProductsOpen(!mobileProductsOpen);
                        }}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label="Toggle Products sub-menu"
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
                            className={`min-h-[40px] flex items-center w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors rounded ${
                              activeCategory === cat.slug
                                ? 'text-[#E5252B] bg-[#22272a]'
                                : 'text-neutral-300 hover:text-white hover:bg-[#22272a]'
                            }`}
                          >
                            {cat.name}
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
                        className="flex-1 min-h-[44px] flex items-center text-left text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-[#E5252B] transition-colors"
                      >
                        {item.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileMediaOpen(!mobileMediaOpen);
                        }}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white"
                        aria-label="Toggle Media sub-menu"
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
                        {MEDIA_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleNavClick('projects')}
                            className="min-h-[40px] flex items-center w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-[#22272a] rounded transition-colors"
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
                className="min-h-[44px] flex items-center justify-center gap-2 bg-[#252a2e] hover:bg-[#E5252B] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E5252B] group-hover:text-white" />
                <span>Call Us: +0800-7777777</span>
              </a>
              <a
                href="mailto:mktg980@prangroup.com"
                className="min-h-[44px] flex items-center justify-center gap-2 bg-[#252a2e] hover:bg-neutral-700 text-neutral-300 text-xs tracking-wide rounded-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>mktg980@prangroup.com</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
