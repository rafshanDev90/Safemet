import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OtpInput } from '../components/OtpInput';

export const MfaPage: React.FC = () => {
  const { tempMfaState, verifyMfa, cancelMfa } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!tempMfaState) {
      navigate('/login', { replace: true });
    }
  }, [tempMfaState, navigate]);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode;
    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyMfa(code);
      success('2FA Verified', 'Authentication successful. Welcome to RN Group.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Invalid 6-digit code. Please try again.';
      setErrorMessage(msg);
      toastError('Verification Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    cancelMfa();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#191D20] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E5252B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-[#E5252B] to-[#C22126] text-white shadow-xl shadow-[#E5252B]/30 mb-4 ring-4 ring-[#E5252B]/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Two-Factor Authentication</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter the 6-digit security code sent to your email address
          </p>
        </div>

        <div className="bg-[#202528] border border-[#384046] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center animate-fade-in">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 p-3 rounded-xl bg-[#191D20] border border-[#384046] flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-[#E5252B] shrink-0" />
            <span>A one-time verification code was dispatched to your registered email. Check your inbox and enter it below.</span>
          </div>

          <div className="py-4">
            <OtpInput
              length={6}
              value={otpCode}
              onChange={(val) => {
                setOtpCode(val);
                if (errorMessage) setErrorMessage(null);
              }}
              onComplete={(code) => handleVerify(code)}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            id="btn-verify-otp"
            onClick={() => handleVerify()}
            disabled={isLoading || otpCode.length !== 6}
            className="w-full mt-6 py-3.5 px-4 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <span>Confirm & Proceed</span>
            )}
          </button>

          <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-[#384046]/60">
            <button
              type="button"
              id="btn-cancel-mfa"
              onClick={handleBackToLogin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </button>

            <p className="text-slate-500">
              Code expires in 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
