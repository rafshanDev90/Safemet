import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, 'id'>) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { ...options, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = options.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback((title: string, description?: string) => toast({ type: 'success', title, description }), [toast]);
  const error = useCallback((title: string, description?: string) => toast({ type: 'error', title, description }), [toast]);
  const info = useCallback((title: string, description?: string) => toast({ type: 'info', title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) => toast({ type: 'warning', title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
      {children}
      {/* Toast viewport */}
      <aside
        id="toast-viewport"
        aria-label="Notification Center"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            id={`toast-${t.id}`}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-200 animate-fade-in bg-[#282E32]/95 border-[#3d454c] text-slate-100"
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#E5252B]" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight text-white">{t.title}</p>
              {t.description && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">{t.description}</p>
              )}
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                  className="mt-2 text-xs font-semibold text-[#E5252B] hover:underline"
                >
                  {t.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              id={`btn-close-toast-${t.id}`}
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
