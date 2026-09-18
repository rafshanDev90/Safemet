import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Users,
  Activity,
  ShieldCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Server,
  Zap,
  Tag,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { KpiCard } from '../components/KpiCard';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonTable';
import { formatCategory, formatDate, formatRelativeTime } from '../lib/utils';

const CATEGORY_COLORS = ['#E5252B', '#EA580C', '#D97706', '#059669', '#2563EB'];

export const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = hasRole('super_admin');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.role],
    queryFn: () => api.dashboard.getStats(user?.role || 'editor'),
    staleTime: 30000,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-xl bg-[#262C31] border border-[#2D3439] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#E5252B]/10 to-transparent pointer-events-none" />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E5252B]/10 text-[#E5252B] border border-[#E5252B]/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            safemete Enterprise Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome, {user?.name || 'Marcus Vancore'}
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-xl">
            {isSuperAdmin
              ? 'Real-time overview of catalog assets, active system users, security policies, and cluster health.'
              : 'Equipment catalog management and technical specifications maintenance workspace.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/products?action=create"
            id="btn-quick-create-product"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </Link>
          {isSuperAdmin && (
            <Link
              to="/users"
              id="btn-quick-manage-users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1E21] hover:bg-[#202528] text-gray-200 hover:text-white border border-[#2D3439] text-sm font-semibold transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: isSuperAdmin ? 4 : 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard
            id="kpi-total-products"
            title="Total Products"
            value={stats?.totalProducts?.toLocaleString() || '1,248'}
            subtitle="Active inventory"
            trend={{ value: '+4.2%', isPositive: true }}
            progressPercent={75}
          />

          {isSuperAdmin && (
            <KpiCard
              id="kpi-active-users"
              title="Active Users"
              value={stats?.activeUsers || 42}
              subtitle="Authorized operators"
              trend={{ value: 'Stable', isPositive: true }}
              progressPercent={60}
            />
          )}

          <KpiCard
            id="kpi-monthly-orders"
            title="Monthly Inquiries"
            value="312"
            subtitle="Commercial RFQs"
            trend={{ value: '+12%', isPositive: true }}
            progressPercent={85}
          />

          <KpiCard
            id="kpi-system-health"
            title="System Health"
            value={`${stats?.systemHealth?.uptimePercentage || 99.8}%`}
            subtitle={`API Latency: ${stats?.systemHealth?.dbLatencyMs || 18}ms`}
            trend={{ value: 'Active Services', isPositive: true }}
            progressPercent={98}
          />
        </div>
      )}

      {/* Analytics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#262C31] border border-[#2D3439] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Product Inventory by Fire Category
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Distribution across industrial certified equipment lines
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#1A1E21] text-gray-300 border border-[#2D3439]">
              Live Inventory
            </span>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Loading visualizer...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.categoryDistribution || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="label"
                    stroke="#8A96A0"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#2D3439' }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#8A96A0"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#2D3439' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#1A1E21] border border-[#2D3439] rounded-lg shadow-xl text-xs text-gray-100">
                            <p className="font-bold text-white">{data.label}</p>
                            <p className="text-gray-400 mt-1">
                              Equipment count: <span className="font-bold text-[#E5252B]">{data.count} units</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {(stats?.categoryDistribution || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Specs & Certification Card */}
        <div className="p-6 rounded-xl bg-[#262C31] border border-[#2D3439] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Compliance Readiness</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              All listed equipment configurations must adhere to regional fire safety mandates and pass quarterly hydrostatic pressure and sensor calibrations.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439] flex items-center justify-between text-xs">
                <span className="text-gray-400">ISO 9001:2015 Quality</span>
                <span className="font-bold text-emerald-400">Certified</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439] flex items-center justify-between text-xs">
                <span className="text-gray-400">EN 54 Fire Detection</span>
                <span className="font-bold text-emerald-400">Compliant</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439] flex items-center justify-between text-xs">
                <span className="text-gray-400">Automatic Backup Vault</span>
                <span className="font-bold text-sky-400">Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2D3439]">
            <Link
              to="/products"
              className="text-xs font-bold text-[#E5252B] hover:text-[#C22126] flex items-center gap-1.5 transition-colors"
            >
              Browse Equipment Directory
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Products & Recent Activities Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products (2 Cols) matching Professional Polish Table Structure */}
        <div className="lg:col-span-2 bg-[#262C31] rounded-xl border border-[#2D3439] flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2D3439] flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Recent Products</h3>
            <Link
              to="/products?action=create"
              className="bg-[#E5252B] hover:bg-[#C22126] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Product
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1A1E21] text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Product Information</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Display Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#2D3439]">
                {(stats?.recentProducts || []).map((product) => {
                  const categoryBadgeColor =
                    product.category === 'fire-detection-alarm-system'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : product.category === 'fire-suppression-system'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : product.category === 'ms-seamless-pipe'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                  return (
                    <tr key={product.id} className="hover:bg-[#2D3439]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1A1E21] rounded border border-[#2D3439] flex items-center justify-center text-[#E5252B] shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full rounded object-cover"
                              />
                            ) : (
                              <Flame className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs">{product.name}</p>
                            <p className="text-xs text-gray-500 font-mono truncate max-w-xs">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-[10px] font-black uppercase rounded border ${categoryBadgeColor}`}
                        >
                          {formatCategory(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-300">
                        {String(product.order).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.isDeleted ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              product.isDeleted ? 'text-red-400' : 'text-emerald-500'
                            }`}
                          >
                            {product.isDeleted ? 'Draft' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/products?edit=${product.id}`}
                          className="text-gray-400 hover:text-[#E5252B] p-1 inline-block transition-colors"
                          title="Edit Product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#1A1E21]/50 border-t border-[#2D3439] flex items-center justify-between text-xs text-gray-500">
            <span>Showing recent additions of {stats?.totalProducts || 1248} products</span>
            <Link
              to="/products"
              className="px-3 py-1 bg-[#2D3439] hover:bg-[#E5252B] transition-colors rounded text-white font-medium"
            >
              Browse All Catalog
            </Link>
          </div>
        </div>

        {/* Audit Activity Stream (Super Admin) or Editorial Guidelines */}
        <div className="bg-[#262C31] rounded-xl border border-[#2D3439] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2D3439]">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {isSuperAdmin ? 'Audit Activity Stream' : 'Editorial Guidelines'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isSuperAdmin ? 'Real-time security log entries' : 'Standards for fire safety specifications'}
                </p>
              </div>
            </div>

            {isSuperAdmin ? (
              <div className="space-y-4">
                {(stats?.recentActivities || []).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#E5252B] mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-200 leading-snug font-medium">
                        <span className="font-bold text-white">{act.userName}:</span> {act.action}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-xs text-gray-300">
                <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439]">
                  <p className="font-bold text-white mb-1">Specification Key-Values</p>
                  <p className="text-gray-400">Always record discharge distance, pressure limits, and chemical agent concentration.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#1A1E21] border border-[#2D3439]">
                  <p className="font-bold text-white mb-1">Standard Slug Formatting</p>
                  <p className="text-gray-400">Use lowercase alphanumeric hyphenated identifiers matching ISO nomenclature.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#2D3439]">
            <p className="text-[11px] text-gray-400">
              safemete Cloud Gateway v2.4 • Node ID: <span className="font-mono text-gray-300">sg-cluster-east-1</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
