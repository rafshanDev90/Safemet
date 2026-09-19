import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Trash2,
  KeyRound,
  Copy,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { editUserSchema, EditUserFormValues } from '../lib/schemas';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SkeletonTable } from '../components/SkeletonTable';
import { EmptyState } from '../components/EmptyState';

export const UsersPage: React.FC = () => {
  const { user: currentUser, hasRole } = useAuth();
  const isSuperAdmin = hasRole('super_admin');
  const queryClient = useQueryClient();
  const { success, error: toastError, info } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 8;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [resetPwdModalOpen, setResetPwdModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [generatedTempPwd, setGeneratedTempPwd] = useState<string | null>(null);
  const [copiedPwd, setCopiedPwd] = useState(false);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', { searchTerm, roleFilter, page, limit }],
    queryFn: () => api.users.list({ search: searchTerm, role: roleFilter, page, limit }),
    enabled: isSuperAdmin,
    staleTime: 30000,
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema) as any,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => api.users.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      success('User Updated', `Changes to ${updated.name} saved successfully.`);
      setEditModalOpen(false);
      setEditingUser(null);
    },
    onError: (err: any) => {
      toastError('Update Failed', err.message || 'Unable to update user profile.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      success('User Deactivated', 'The user account has been deactivated.');
      setDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: (err: any) => {
      toastError('Action Blocked', err.message || 'Unable to delete user.');
    },
  });

  const resetPwdMutation = useMutation({
    mutationFn: (id: string) => api.users.resetPassword(id),
    onSuccess: (res) => {
      if (res.tempPassword) {
        setGeneratedTempPwd(res.tempPassword);
      }
      success('Password Reset', 'A temporary password was generated.');
    },
    onError: (err: any) => {
      toastError('Reset Failed', err.message || 'Unable to reset user password.');
    },
  });

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#282E32] border border-[#384046] text-center max-w-lg mx-auto mt-12 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Super Admin Access Required</h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          User Management, role assignments, and authentication policy controls are restricted to Super Administrators.
        </p>
      </div>
    );
  }

  const openEditModal = (u: User) => {
    setEditingUser(u);
    resetEdit({
      name: u.name,
      role: u.role,
      mfaEnabled: u.mfaEnabled,
    });
    setEditModalOpen(true);
  };

  const handleCopyTempPwd = () => {
    if (generatedTempPwd) {
      navigator.clipboard.writeText(generatedTempPwd);
      setCopiedPwd(true);
      setTimeout(() => setCopiedPwd(false), 2000);
      info('Copied', 'Temporary password copied to clipboard.');
    }
  };

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            User Accounts & Permissions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Super Admin directory for operational roles, 2FA security enforcement, and account lifecycle
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#282E32] border border-[#384046] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-user-search"
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5252B] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="select-user-role-filter"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl bg-[#191D20] border border-[#384046] text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#E5252B] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admins</option>
            <option value="editor">Editors</option>
            <option value="support_staff">Support Staff</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={limit} columns={7} />
      ) : !users.length ? (
        <EmptyState
          title="No Users Found"
          description="No team member accounts matched your criteria."
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : (
        <div className="bg-[#282E32] rounded-2xl border border-[#384046] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#191D20] text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-[#384046]">
                <tr>
                  <th scope="col" className="py-4 px-4">User</th>
                  <th scope="col" className="py-4 px-4">Email</th>
                  <th scope="col" className="py-4 px-4">Role Badge</th>
                  <th scope="col" className="py-4 px-4 text-center">2FA Status</th>
                  <th scope="col" className="py-4 px-4">Last Login</th>
                  <th scope="col" className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#384046]/70">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} id={`user-row-${u.id}`} className="hover:bg-[#191D20]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E5252B] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                            {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white leading-tight truncate flex items-center gap-1.5">
                              {u.name}
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                  You
                                </span>
                              )}
                            </p>
                            <span className="text-[11px] text-slate-400">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          u.role === 'super_admin'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : u.role === 'editor'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {u.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-600/20 text-slate-400 border border-slate-500/20">
                            <Shield className="w-3 h-3" /> Off
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{u.lastLoginAt || 'Never'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#191D20] transition-colors"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setUserToReset(u); setResetPwdModalOpen(true); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Reset password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }}
                            disabled={isCurrent}
                            className={`p-2 rounded-lg transition-colors ${
                              isCurrent ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-[#E5252B] hover:bg-red-500/10 cursor-pointer'
                            }`}
                            title={isCurrent ? 'Cannot delete own account' : 'Deactivate account'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="p-4 bg-[#191D20] border-t border-[#384046] flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing <span className="font-bold text-white">{users.length}</span> of{' '}
                <span className="font-bold text-white">{pagination.total}</span> users
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-xl bg-[#282E32] text-slate-300 hover:text-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-semibold text-white">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="p-2 rounded-xl bg-[#282E32] text-slate-300 hover:text-white disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) { setEditModalOpen(false); setEditingUser(null); } }}
        >
          <div className="w-full max-w-md bg-[#282E32] border border-[#384046] rounded-3xl p-6 text-slate-100 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#384046]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#E5252B]/15 text-[#E5252B]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Edit User</h3>
              </div>
              <button type="button" onClick={() => { setEditModalOpen(false); setEditingUser(null); }} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit((data) => updateMutation.mutate({ id: editingUser.id, data }))}
              className="space-y-4 mt-4"
              noValidate
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  {...registerEdit('name')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B]"
                />
                {errorsEdit.name && <p className="text-xs text-red-400 mt-1">{errorsEdit.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Role</label>
                <select
                  {...registerEdit('role')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191D20] border border-[#384046] text-sm text-white focus:outline-none focus:border-[#E5252B] cursor-pointer"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="editor">Editor</option>
                  <option value="support_staff">Support Staff</option>
                </select>
                {errorsEdit.role && <p className="text-xs text-red-400 mt-1">{errorsEdit.role.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">MFA Enforcement</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...registerEdit('mfaEnabled')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-[#E5252B]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5252B]"></div>
                </label>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-[#384046]">
                <button
                  type="button"
                  onClick={() => { setEditModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-[#384046] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-xs font-bold shadow-lg shadow-[#E5252B]/25 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {(isSubmittingEdit || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={() => { if (userToDelete) deleteMutation.mutate(userToDelete.id); }}
        title="Deactivate User Account?"
        description={`Are you sure you want to deactivate ${userToDelete?.name}'s account? They will be unable to log in.`}
        confirmLabel="Deactivate"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />

      {/* Reset Password Modal */}
      {resetPwdModalOpen && userToReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) { setResetPwdModalOpen(false); setUserToReset(null); setGeneratedTempPwd(null); } }}
        >
          <div className="w-full max-w-md bg-[#282E32] border border-[#384046] rounded-3xl p-6 text-slate-100 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#384046]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
              </div>
              <button type="button" onClick={() => { setResetPwdModalOpen(false); setUserToReset(null); setGeneratedTempPwd(null); }} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatedTempPwd ? (
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-xl bg-[#191D20] border border-emerald-500/30">
                  <p className="text-xs text-slate-400 mb-2">Temporary password for <span className="font-semibold text-white">{userToReset.name}</span>:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-[#282E32] border border-[#384046] font-mono text-sm text-emerald-400">{generatedTempPwd}</code>
                    <button
                      type="button"
                      onClick={handleCopyTempPwd}
                      className="p-2 rounded-lg bg-[#282E32] text-slate-300 hover:text-white border border-[#384046]"
                    >
                      {copiedPwd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setResetPwdModalOpen(false); setUserToReset(null); setGeneratedTempPwd(null); }}
                  className="w-full py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-300">
                  Generate a new temporary password for <span className="font-semibold text-white">{userToReset.name}</span>? They will need to use this on next login.
                </p>
                <div className="pt-3 flex justify-end gap-2 border-t border-[#384046]">
                  <button
                    type="button"
                    onClick={() => { setResetPwdModalOpen(false); setUserToReset(null); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-[#384046]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPwdMutation.mutate(userToReset.id)}
                    disabled={resetPwdMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2"
                  >
                    {resetPwdMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Generate Temp Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
