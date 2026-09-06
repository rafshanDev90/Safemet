import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    const arr = Array(length).fill('');
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i];
    }
    setDigits(arr);
  }, [value, length]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    // If user pasted or typed multiple digits
    if (val.length > 1) {
      const pasted = val.slice(0, length).split('');
      for (let i = 0; i < length; i++) {
        newDigits[i] = pasted[i] || '';
      }
      const combined = newDigits.join('');
      onChange(combined);
      if (combined.length === length && onComplete) {
        onComplete(combined);
      }
      const nextIdx = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = val;
    setDigits(newDigits);
    const combined = newDigits.join('');
    onChange(combined);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newDigits = [...digits];
    for (let i = 0; i < length; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);
    const combined = newDigits.join('').slice(0, length);
    onChange(combined);

    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
    const focusTarget = Math.min(combined.length, length - 1);
    inputRefs.current[focusTarget]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-sm mx-auto">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          id={`otp-digit-input-${idx}`}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          disabled={disabled}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono rounded-xl border bg-[#191D20] transition-all outline-none ${
            digits[idx]
              ? 'border-[#E5252B] text-white shadow-lg shadow-[#E5252B]/10'
              : 'border-[#384046] text-slate-300 focus:border-[#E5252B] focus:ring-2 focus:ring-[#E5252B]/20'
          } disabled:opacity-50`}
          aria-label={`Digit ${idx + 1} of ${length}`}
        />
      ))}
    </div>
  );
};
