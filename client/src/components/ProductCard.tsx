import React from 'react';
import { ProductItem } from '../productsData';

interface ProductCardProps {
  product: ProductItem;
  displayNumber: string; // e.g. "01", "02", "03"...
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayNumber,
  onClick,
}) => {
  const renderGraphic = () => {
    if (product.graphicType === 'osy-flanged') {
      return (
        <svg viewBox="0 0 200 240" className="w-44 h-52 text-red-600 drop-shadow-md">
          <ellipse cx="100" cy="25" rx="45" ry="12" fill="none" stroke="#222" strokeWidth="6" />
          <line x1="100" y1="13" x2="100" y2="37" stroke="#222" strokeWidth="4" />
          <line x1="55" y1="25" x2="145" y2="25" stroke="#222" strokeWidth="4" />
          <rect x="96" y="25" width="8" height="60" fill="#e5e5e5" stroke="#888" strokeWidth="1" />
          <path d="M75 85 L95 40 L105 40 L125 85 Z" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <rect x="65" y="85" width="70" height="20" rx="3" fill="#d32f2f" stroke="#a00" strokeWidth="2" />
          <rect x="75" y="105" width="50" height="75" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <rect x="35" y="115" width="18" height="70" rx="2" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <rect x="53" y="125" width="22" height="50" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <rect x="147" y="115" width="18" height="70" rx="2" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <rect x="125" y="125" width="22" height="50" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <circle cx="44" cy="125" r="3" fill="#222" />
          <circle cx="44" cy="150" r="3" fill="#222" />
          <circle cx="44" cy="175" r="3" fill="#222" />
          <circle cx="156" cy="125" r="3" fill="#222" />
          <circle cx="156" cy="150" r="3" fill="#222" />
          <circle cx="156" cy="175" r="3" fill="#222" />
        </svg>
      );
    }

    if (product.graphicType === 'osy-grooved') {
      return (
        <svg viewBox="0 0 200 240" className="w-44 h-52 text-red-600 drop-shadow-md">
          <ellipse cx="100" cy="25" rx="45" ry="12" fill="none" stroke="#222" strokeWidth="6" />
          <line x1="100" y1="13" x2="100" y2="37" stroke="#222" strokeWidth="4" />
          <line x1="55" y1="25" x2="145" y2="25" stroke="#222" strokeWidth="4" />
          <rect x="96" y="25" width="8" height="60" fill="#e5e5e5" stroke="#888" strokeWidth="1" />
          <path d="M75 85 L95 40 L105 40 L125 85 Z" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <rect x="65" y="85" width="70" height="20" rx="3" fill="#d32f2f" stroke="#a00" strokeWidth="2" />
          <rect x="75" y="105" width="50" height="75" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <rect x="42" y="125" width="33" height="50" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <line x1="52" y1="125" x2="52" y2="175" stroke="#444" strokeWidth="4" />
          <rect x="125" y="125" width="33" height="50" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <line x1="148" y1="125" x2="148" y2="175" stroke="#444" strokeWidth="4" />
        </svg>
      );
    }

    if (product.graphicType === 'pillar-hydrant') {
      return (
        <svg viewBox="0 0 200 240" className="w-44 h-52 drop-shadow-md">
          <polygon points="90,20 110,20 115,35 85,35" fill="#a00" stroke="#600" strokeWidth="1.5" />
          <path d="M70,55 Q100,32 130,55 Z" fill="#d32f2f" stroke="#800" strokeWidth="2" />
          <rect x="75" y="55" width="50" height="40" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <rect x="40" y="65" width="35" height="24" rx="3" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <circle cx="38" cy="77" r="10" fill="#222" />
          <rect x="125" y="65" width="35" height="24" rx="3" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <circle cx="162" cy="77" r="10" fill="#222" />
          <rect x="78" y="95" width="44" height="95" fill="#e5252b" stroke="#b01015" strokeWidth="2" />
          <rect x="60" y="190" width="80" height="16" rx="2" fill="#c81e1e" stroke="#900" strokeWidth="2" />
          <circle cx="70" cy="198" r="3" fill="#222" />
          <circle cx="130" cy="198" r="3" fill="#222" />
        </svg>
      );
    }

    if (
      product.graphicType === 'sprinkler-upright' ||
      product.graphicType === 'sprinkler-pendent' ||
      product.graphicType === 'sprinkler-flush'
    ) {
      return (
        <svg viewBox="0 0 160 200" className="w-36 h-48 drop-shadow-md">
          <rect x="60" y="30" width="40" height="35" rx="1" fill="#d4af37" stroke="#aa8c2c" strokeWidth="2" />
          <line x1="60" y1="40" x2="100" y2="40" stroke="#8c7324" strokeWidth="2" />
          <line x1="60" y1="50" x2="100" y2="50" stroke="#8c7324" strokeWidth="2" />
          <rect x="52" y="65" width="56" height="15" rx="2" fill="#c5a028" stroke="#8c7324" strokeWidth="1.5" />
          <path d="M56 80 Q50 120 78 140" fill="none" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" />
          <path d="M104 80 Q110 120 82 140" fill="none" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" />
          <rect x="76" y="80" width="8" height="50" rx="4" fill="#e5252b" stroke="#aa1015" strokeWidth="1" />
          <circle cx="80" cy="105" r="2.5" fill="#ffffff" />
          {product.graphicType === 'sprinkler-upright' ? (
            <path d="M50 145 L110 145 M55 140 L55 150 M70 140 L70 150 M80 140 L80 150 M90 140 L90 150 M105 140 L105 150" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" />
          ) : product.graphicType === 'sprinkler-flush' ? (
            <circle cx="80" cy="142" r="24" fill="none" stroke="#e0e0e0" strokeWidth="5" />
          ) : (
            <path d="M52 142 L108 142 L100 152 L60 152 Z" fill="#d4af37" stroke="#aa8c2c" strokeWidth="2" />
          )}
        </svg>
      );
    }

    if (product.graphicType === 'pressure-gauge') {
      return (
        <svg viewBox="0 0 180 200" className="w-40 h-48 drop-shadow-md">
          <rect x="80" y="145" width="20" height="35" fill="#d4af37" stroke="#aa8c2c" strokeWidth="2" />
          <circle cx="90" cy="85" r="65" fill="#f8f9fa" stroke="#444" strokeWidth="7" />
          <circle cx="90" cy="85" r="58" fill="#ffffff" stroke="#ccc" strokeWidth="1" />
          <circle cx="90" cy="85" r="50" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="3, 7" />
          <text x="90" y="65" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">0 - 300 PSI</text>
          <text x="90" y="115" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#e5252b">WATER / AIR</text>
          <line x1="90" y1="85" x2="120" y2="60" stroke="#e5252b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="90" cy="85" r="5" fill="#222" />
        </svg>
      );
    }

    if (product.graphicType === 'flow-switch') {
      return (
        <svg viewBox="0 0 200 200" className="w-44 h-48 drop-shadow-md">
          <path d="M60 130 C60 180 140 180 140 130" fill="none" stroke="#888" strokeWidth="8" />
          <rect x="52" y="125" width="16" height="10" fill="#222" />
          <rect x="132" y="125" width="16" height="10" fill="#222" />
          <rect x="70" y="50" width="60" height="65" rx="6" fill="#e5252b" stroke="#aa1015" strokeWidth="2.5" />
          <circle cx="100" cy="82" r="14" fill="#ffdd00" stroke="#ccaa00" strokeWidth="2" />
          <rect x="85" y="32" width="30" height="18" fill="#555" rx="2" />
        </svg>
      );
    }

    if (product.graphicType === 'sprinkler-sidewall') {
      return (
        <svg viewBox="0 0 180 200" className="w-40 h-48 drop-shadow-md">
          <rect x="25" y="85" width="40" height="30" fill="#d4af37" stroke="#aa8c2c" strokeWidth="2" />
          <rect x="65" y="80" width="15" height="40" fill="#c5a028" stroke="#8c7324" strokeWidth="1.5" />
          <path d="M80 85 L130 75 M80 115 L130 125" stroke="#d4af37" strokeWidth="5" strokeLinecap="round" />
          <rect x="90" y="96" width="35" height="8" rx="4" fill="#e5252b" stroke="#aa1015" strokeWidth="1" />
          <path d="M135 60 L135 140 L150 140 L150 60 Z" fill="#d4af37" stroke="#aa8c2c" strokeWidth="1.5" />
          <path d="M135 60 Q160 50 165 75" fill="none" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }

    return (
      <img
        src={product.image}
        alt={product.name}
        className="max-h-[220px] sm:max-h-[240px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    );
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      onClick={onClick}
      className="group flex flex-col cursor-pointer transition-all duration-200"
    >
      {/* Product Image on Pure White Background */}
      <div className="w-full h-[240px] sm:h-[270px] lg:h-[290px] flex items-center justify-center p-4 bg-white transition-all duration-300">
        {renderGraphic()}
      </div>

      {/* Number and Product Title Row */}
      <div className="mt-4 flex items-center">
        {/* Large Light-Gray Bold Number (e.g., 01, 02...) */}
        <span className="text-4xl sm:text-5xl lg:text-[54px] font-black text-neutral-200 group-hover:text-neutral-300 transition-colors tracking-tighter mr-3 sm:mr-4 shrink-0 leading-none select-none">
          {displayNumber}
        </span>

        {/* Product Name in Bold */}
        <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1f2428] group-hover:text-[#E5252B] transition-colors uppercase leading-snug">
          {product.name}
        </h3>
      </div>
    </div>
  );
};
