import React from 'react';
import logo from '../assets/logo/logo.png';

interface RNGroupLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RNGroupLogo: React.FC<RNGroupLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses =
    size === 'sm' ? 'h-8 sm:h-9' : size === 'lg' ? 'h-11 sm:h-14' : 'h-12 sm:h-14 lg:h-16';
  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`} id="rn-group-logo">
      <img
        src={logo}
        alt="RN Group Logo"
        className={`${sizeClasses} w-auto object-contain`}
      />
    </div>
  );
};
