import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#384046] bg-[#282E32]/40 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#191D20] border border-[#384046] flex items-center justify-center text-[#E5252B] mb-4 shadow-inner">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          id="btn-empty-state-action"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-semibold shadow-lg shadow-[#E5252B]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
