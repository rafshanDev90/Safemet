import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-backdrop-confirmation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="w-full max-w-md bg-[#282E32] border border-[#3d454c] rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 animate-fade-in"
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDestructive ? 'bg-[#E5252B]/15 text-[#E5252B]' : 'bg-amber-500/15 text-amber-400'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            <p id="confirm-modal-desc" className="text-sm text-slate-300 mt-2 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            id="btn-close-confirm-modal"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#384046]">
          <button
            type="button"
            id="btn-cancel-confirmation"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 border border-[#454e55] transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            id="btn-confirm-action"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              isDestructive
                ? 'bg-[#E5252B] hover:bg-[#C22126] shadow-[#E5252B]/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
