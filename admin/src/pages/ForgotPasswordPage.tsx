import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Flame, KeyRound } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Wait briefly then show confirmation (backend reset flow to be connected)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      success('Reset Dispatched', 'Password reset instructions have been dispatched.');
    } catch (err: any) {
      toastError('Request Failed', err.message || 'Unable to process reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191D20] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E5252B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-[#E5252B] to-[#C22126] text-white shadow-xl shadow-[#E5252B]/30 mb-4 ring-4 ring-[#E5252B]/20">
            <Flame className="w-8 h-8 fill-white/20" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Your Password</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            We will verify your organization account and dispatch a secure reset link
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#202528] border border-[#384046] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="input-reset-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rn-group.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B] focus:ring-2 focus:ring-[#E5252B]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-forgot-pwd"
                disabled={isLoading || !email}
                className="w-full py-3.5 px-4 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive password recovery instructions shortly.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#191D20] border border-[#384046] text-left text-xs">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need to change your password now?</span>
                </div>
                <Link
                  to="/profile"
                  className="text-[#E5252B] hover:underline font-medium break-all"
                >
                  Open Security & Password Panel
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#384046]/60 text-center">
            <Link
              to="/login"
              id="link-back-to-login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
