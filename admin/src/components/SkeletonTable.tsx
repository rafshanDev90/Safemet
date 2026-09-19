import React from 'react';

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="w-full bg-[#282E32] rounded-xl border border-[#384046] overflow-hidden">
      <div className="p-4 border-b border-[#384046] bg-[#191D20]/50 animate-pulse flex items-center justify-between">
        <div className="h-5 bg-slate-700 rounded w-48" />
        <div className="h-8 bg-slate-700 rounded w-32" />
      </div>
      <div className="divide-y divide-[#384046]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center gap-4 animate-pulse">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-700/60 rounded"
                style={{ width: `${Math.max(12, 100 / columns - 3)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-[#282E32] border border-[#384046] animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-700 rounded w-24" />
        <div className="w-8 h-8 bg-slate-700 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-700 rounded w-20" />
      <div className="h-3 bg-slate-700/60 rounded w-36" />
    </div>
  );
};
