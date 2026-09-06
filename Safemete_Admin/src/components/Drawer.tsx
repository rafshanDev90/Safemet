import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-2xl',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`w-full ${width} h-full bg-[#202528] border-l border-[#384046] shadow-2xl flex flex-col justify-between text-slate-100 animate-slide-in-right overflow-hidden`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#384046] flex items-center justify-between bg-[#191D20]/80">
          <div>
            <h2 id="drawer-title" className="text-xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>

          <button
            type="button"
            id="btn-close-drawer"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>

        {/* Optional Footer */}
        {footer && <div className="p-6 border-t border-[#384046] bg-[#191D20]">{footer}</div>}
      </div>
    </div>
  );
};
