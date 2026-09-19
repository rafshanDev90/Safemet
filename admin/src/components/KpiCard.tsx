import React from 'react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progressPercent?: number;
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  trend,
  progressPercent = 75,
}) => {
  return (
    <div
      id={id}
      className="bg-[#262C31] p-6 rounded-xl border border-[#2D3439] relative overflow-hidden flex flex-col justify-between transition-all hover:border-[#3E454D]"
    >
      {/* Subtle top-right decorative accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#E5252B]/5 rounded-bl-full pointer-events-none" />

      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          {trend && (
            <span
              className={`text-xs font-bold ${
                trend.isPositive ? 'text-emerald-400' : 'text-[#E5252B]'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#1A1E21] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E5252B] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, progressPercent))}%` }}
          />
        </div>
        {subtitle && (
          <span className="text-[11px] text-gray-500 font-medium truncate max-w-[120px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

