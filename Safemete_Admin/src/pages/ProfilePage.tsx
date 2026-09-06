import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Shield,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Moon,
  Sun,
  ShieldCheck,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import {
  changePasswordSchema,
  profileUpdateSchema,
  ChangePasswordFormValues,
  ProfileUpdateFormValues,
} from '../lib/schemas';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error: toastError, info } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'mfa' | 'preferences'>('profile');
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedNewPassword = watchPassword('newPassword');

  // Mutation: Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileUpdateFormValues) => api.users.update(user!.id, values),
    onSuccess: (updatedUser) => {
      updateCurrentUserProfile(updatedUser);
      success('Profile Updated', 'Your profile details have been saved.');
    },
    onError: (err: any) => {
      toastError('Update Failed', err.message || 'Unable to update profile.');
    },
  });

  // Mutation: Change Password
  const changePasswordMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      api.users.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    onSuccess: () => {
      success('Password Changed', 'Your password has been updated successfully.');
      resetPasswordForm();
    },
    onError: (err: any) => {
      toastError('Password Change Failed', err.message || 'Unable to change password.');
    },
  });

  // Mutation: Toggle MFA
  const toggleMfaMutation = useMutation({
    mutationFn: (enabled: boolean) => api.users.update(user!.id, { mfaEnabled: enabled }),
    onSuccess: (updatedUser) => {
      updateCurrentUserProfile(updatedUser);
      if (updatedUser.mfaEnabled) {
        success('2FA Activated', 'Two-Factor Authentication is now enforced for your login.');
      } else {
        info('2FA Deactivated', 'Two-Factor Authentication has been removed.');
      }
    },
    onError: (err: any) => {
      toastError('MFA Toggle Failed', err.message || 'Unable to update MFA status.');
    },
  });

  const onSaveProfile = (values: ProfileUpdateFormValues) => {
    if (!user) return;
    updateProfileMutation.mutate(values);
  };

  const onChangePassword = (values: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(values);
  };

  const handleToggleMfa = () => {
    if (!user) return;
    toggleMfaMutation.mutate(!user.mfaEnabled);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
    info('Copied', 'Base32 secret key copied to clipboard.');
  };

  const backupCodes = [
    '8831-4092',
    '1923-8841',
    '7741-2098',
    '3391-4402',
    '6619-3301',
    '4590-7712',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account Profile & Security Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage credentials, multi-factor authentication, and portal preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#384046] overflow-x-auto pb-px">
        {[
          { id: 'profile', label: 'Profile Information', icon: Shield },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'mfa', label: 'Two-Factor Auth (2FA)', icon: ShieldCheck },
          { id: 'preferences', label: 'System Preferences', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-settings-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#E5252B] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#282E32] border border-[#384046]">
            <h3 className="text-base font-bold text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...registerProfile('name')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
                />
                {errorsProfile.name && <p className="text-xs text-red-400 mt-1">{errorsProfile.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Work Email (Managed by Organization)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191D20]/60 border border-[#384046] text-sm text-slate-400 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-500 mt-1">To change work email, contact system security.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingProfile || updateProfileMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-xs font-bold shadow-lg shadow-[#E5252B]/25 cursor-pointer"
                >
                  {(isSubmittingProfile || updateProfileMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-[#282E32] border border-[#384046] flex flex-col items-center text-center justify-between">
            <div>
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 rounded-2xl bg-[#E5252B] text-white flex items-center justify-center font-bold text-2xl shadow-xl">
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </div>
              </div>
              <h4 className="text-base font-bold text-white">{user?.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5252B]/15 text-[#E5252B] border border-[#E5252B]/30 text-xs font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user?.role.replace('_', ' ')}
              </div>
            </div>

            <div className="w-full pt-4 mt-4 border-t border-[#384046] text-left text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-slate-200">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-slate-200">{user?.createdAt ? user.createdAt.slice(0, 10) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Password & Security */}
      {activeTab === 'security' && (
        <div className="max-w-2xl p-6 rounded-3xl bg-[#282E32] border border-[#384046] animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Change Account Password</h3>
          </div>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            Ensure your password is at least 8 characters long and contains uppercase letters, lowercase letters, and digits.
          </p>

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                {...registerPassword('currentPassword')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
              />
              {errorsPassword.currentPassword && (
                <p className="text-xs text-red-400 mt-1">{errorsPassword.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                {...registerPassword('newPassword')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
              />
              <PasswordStrengthMeter password={watchedNewPassword || ''} />
              {errorsPassword.newPassword && (
                <p className="text-xs text-red-400 mt-1">{errorsPassword.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                {...registerPassword('confirmPassword')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
              />
              {errorsPassword.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{errorsPassword.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingPassword || changePasswordMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-xs font-bold shadow-lg shadow-[#E5252B]/25 flex items-center gap-2 cursor-pointer"
              >
                {(isSubmittingPassword || changePasswordMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Two-Factor Authentication (2FA) */}
      {activeTab === 'mfa' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Status & Toggle */}
          <div className="p-6 rounded-3xl bg-[#282E32] border border-[#384046] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Email OTP Authentication</h3>
                <p className="text-xs text-slate-400">One-time codes sent to your registered email address</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user?.mfaEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {user?.mfaEnabled ? '2FA Active' : '2FA Disabled'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#191D20] border border-[#384046]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-[#E5252B]/10 border border-[#E5252B]/20">
                  <ShieldCheck className="w-6 h-6 text-[#E5252B]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Email-Based Two-Factor Authentication</p>
                  <p className="text-xs text-slate-400">When enabled, a 6-digit verification code will be sent to <span className="font-mono text-slate-300">{user?.email}</span> during each login.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-300">Authentication Enforcement:</span>
              <button
                type="button"
                id="btn-toggle-2fa-status"
                onClick={handleToggleMfa}
                disabled={toggleMfaMutation.isPending}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  user?.mfaEnabled
                    ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                }`}
              >
                {toggleMfaMutation.isPending ? 'Updating...' : user?.mfaEnabled ? 'Disable 2FA' : 'Enable & Enforce 2FA'}
              </button>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="p-6 rounded-3xl bg-[#282E32] border border-[#384046] flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Emergency Backup Codes</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                If you lose access to your email, you can use these single-use recovery keys.
              </p>

              <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-[#191D20] border border-[#384046]">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between font-mono text-xs text-slate-200 bg-[#282E32]/60 px-2.5 py-1.5 rounded-lg border border-[#384046]">
                    <span>{code}</span>
                    <CheckCircle2 className="w-3 h-3 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#384046] flex items-center justify-between text-xs">
              <span className="text-slate-400">Store in a secure password manager.</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                  info('Copied', 'All backup codes copied.');
                }}
                className="font-semibold text-[#E5252B] hover:underline cursor-pointer"
              >
                Copy All Codes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: System Preferences */}
      {activeTab === 'preferences' && (
        <div className="max-w-2xl p-6 rounded-3xl bg-[#282E32] border border-[#384046] space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-white">Appearance Settings</h3>
            <p className="text-xs text-slate-400">Configure visual theme for the admin portal</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#191D20] border border-[#384046] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Interface Theme</p>
              <p className="text-xs text-slate-400">
                Currently running in <span className="font-semibold text-slate-200 capitalize">{theme} mode</span>
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[#282E32] text-slate-200 hover:text-white border border-[#384046] flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>Toggle to {theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
