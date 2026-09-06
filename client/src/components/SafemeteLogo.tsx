import React from 'react';

interface SafemeteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SafemeteLogo: React.FC<SafemeteLogoProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`} id="safemete-logo">
      {/* Shield & Wings Emblem */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 80"
          className={size === 'sm' ? 'w-9 h-7' : size === 'lg' ? 'w-14 h-11' : 'w-11 h-9'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Wings */}
          <path
            d="M5 32C18 30 32 36 40 46C30 42 18 40 8 46C12 39 10 34 5 32Z"
            fill="#E5252B"
          />
          <path
            d="M95 32C82 30 68 36 60 46C70 42 82 40 92 46C88 39 90 34 95 32Z"
            fill="#E5252B"
          />
          <path
            d="M14 22C24 24 34 32 40 40C32 35 22 32 12 34C15 28 15 24 14 22Z"
            fill="#FFFFFF"
          />
          <path
            d="M86 22C76 24 66 32 60 40C68 35 78 32 88 34C85 28 85 24 86 22Z"
            fill="#FFFFFF"
          />
          <path
            d="M20 12C32 16 42 26 46 36C38 30 28 26 18 26C21 20 21 15 20 12Z"
            fill="#E5252B"
          />
          <path
            d="M80 12C68 16 58 26 54 36C62 30 72 26 82 26C79 20 79 15 80 12Z"
            fill="#E5252B"
          />

          {/* Central Shield */}
          <path
            d="M50 8L36 18V44C36 58 50 72 50 72C50 72 64 58 64 44V18L50 8Z"
            fill="#E5252B"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          
          {/* Inner Shield Inset */}
          <path
            d="M50 14L40 22V42C40 52 50 63 50 63C50 63 60 52 60 42V22L50 14Z"
            fill="#B81419"
          />

          {/* Golden / White Flame in Shield */}
          <path
            d="M50 24C47 31 43 35 45 42C46 47 48 51 50 53C52 51 54 47 55 42C57 35 53 31 50 24Z"
            fill="#FFFFFF"
          />
          <path
            d="M50 32C48 36 46 39 47 44C48 47 49 49 50 51C51 49 52 47 53 44C54 39 52 36 50 32Z"
            fill="#FBBF24"
          />
        </svg>
      </div>

      {/* Brand Text & Slogan */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tighter">
          <span className="font-extrabold italic text-[#E5252B] text-xl tracking-wider uppercase font-['Montserrat',sans-serif] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            SAFEMETE
          </span>
          <span className="text-[#E5252B] font-bold text-xs ml-0.5 -mt-2">®</span>
        </div>
        <div className="bg-[#121416] px-1.5 py-[2px] rounded-sm mt-0.5 border border-neutral-700/50">
          <span className="text-[7.5px] uppercase font-bold tracking-wider text-neutral-200 block whitespace-nowrap leading-none">
            Fire Safety Equipment &amp; Solution
          </span>
        </div>
      </div>
    </div>
  );
};
