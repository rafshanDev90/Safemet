import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Flame, Lock, Mail, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginFormSchema, LoginFormValues } from '../lib/schemas';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session_expired');

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    sessionExpired ? 'Your active session has expired. Please sign in again.' : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema) as any,
    defaultValues: {
      email: 'admin@safemete.com',
      password: 'Admin@12345',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await login(data);
      if (res.requiresMfa) {
        navigate('/mfa');
      } else {
        toastSuccess('Welcome back', 'Successfully logged in to safemete Admin Panel.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to authenticate. Please check your credentials.';
      setAuthError(msg);
      toastError('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: 'admin' | 'editor') => {
    if (role === 'admin') {
      setValue('email', 'admin@safemete.com');
      setValue('password', 'Admin@12345');
    } else {
      setValue('email', 'editor@safemete.com');
      setValue('password', 'EditorPassword123!');
    }
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-[#191D20] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E5252B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-[#E5252B] to-[#C22126] text-white shadow-xl shadow-[#E5252B]/30 mb-4 ring-4 ring-[#E5252B]/20">
            <Flame className="w-8 h-8 fill-white/20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            safemete
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Fire Safety Equipment Enterprise Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#202528] border border-[#384046] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-[#E5252B] shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email field */}
            <div>
              <label htmlFor="input-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@safemete.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#191D20] border text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#384046] focus:border-[#E5252B] focus:ring-2 focus:ring-[#E5252B]/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  id="link-forgot-password"
                  className="text-xs text-slate-400 hover:text-[#E5252B] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#191D20] border text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#384046] focus:border-[#E5252B] focus:ring-2 focus:ring-[#E5252B]/20'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="checkbox-remember-me"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded-md bg-[#191D20] border-[#384046] text-[#E5252B] focus:ring-[#E5252B] focus:ring-offset-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-login"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#384046]/60">
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleQuickFill('admin')}
                className="p-2.5 rounded-xl bg-[#191D20] hover:bg-[#282E32] border border-[#384046] text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#E5252B]">
                  Super Admin
                </div>
                <div className="text-[10px] text-slate-400">admin@safemete.com</div>
              </button>

              <button
                type="button"
                id="btn-demo-editor"
                onClick={() => handleQuickFill('editor')}
                className="p-2.5 rounded-xl bg-[#191D20] hover:bg-[#282E32] border border-[#384046] text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#E5252B]">
                  Catalog Editor
                </div>
                <div className="text-[10px] text-slate-400">editor@safemete.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protected with AES-256 and Multi-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
};
