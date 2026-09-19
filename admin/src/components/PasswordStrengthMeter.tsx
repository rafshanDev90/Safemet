import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteria = [
    { label: '8+ characters', met: hasMinLength },
    { label: 'Uppercase letter (A-Z)', met: hasUppercase },
    { label: 'Lowercase letter (a-z)', met: hasLowercase },
    { label: 'Number (0-9)', met: hasNumber },
    { label: 'Special symbol (!@#$)', met: hasSpecial },
  ];

  const score = criteria.filter((c) => c.met).length;

  let strengthLabel = 'Very Weak';
  let barColor = 'bg-red-500';

  if (score >= 5) {
    strengthLabel = 'Strong';
    barColor = 'bg-emerald-500';
  } else if (score >= 4) {
    strengthLabel = 'Good';
    barColor = 'bg-teal-500';
  } else if (score >= 3) {
    strengthLabel = 'Fair';
    barColor = 'bg-amber-500';
  } else if (score >= 2) {
    strengthLabel = 'Weak';
    barColor = 'bg-orange-500';
  }

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Password Strength:</span>
        <span className={`font-semibold ${score >= 4 ? 'text-emerald-400' : score >= 3 ? 'text-amber-400' : 'text-red-400'}`}>
          {strengthLabel}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < score ? barColor : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[11px]">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 ${
              item.met ? 'text-emerald-400 font-medium' : 'text-slate-400'
            }`}
          >
            {item.met ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 text-slate-500" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
