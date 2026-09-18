import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LogOut,
  ShieldCheck,
  Package,
  Layers,
  UploadCloud,
  FileBarChart,
  Users,
  LayoutDashboard,
  Tag,
  ShoppingCart,
  CreditCard,
  UserCog,
  UserCheck,
  Contact,
  BarChart3,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  UserCircle,
  Settings,
  Plus,
  Database,
  User,
  Mail,
  Calendar,
  Shield,
  MoreHorizontal,
  AlertCircle,
  Server,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/* ─────────────────────────────────────────────
   Sidebar Navigation Configuration
   ───────────────────────────────────────────── */
const sidebarNav = [
  {
    group: 'DASHBOARD',
    items: [
      { label: 'Tổng quan', icon: LayoutDashboard, path: '/dashboard', active: false },
    ],
  },
  {
    group: 'PRODUCT MANAGEMENT',
    items: [
      { label: 'Sản phẩm', icon: Package, path: '/products' },
      { label: 'Danh mục & Thuộc tính', icon: Layers, path: '/categories' },
      { label: 'Thương hiệu', icon: Tag, path: '/brands' },
    ],
  },
  {
    group: 'ORDER MANAGEMENT',
    items: [
      { label: 'Đơn hàng', icon: ShoppingCart, path: '/orders' },
      { label: 'Giao dịch', icon: CreditCard, path: '/transactions' },
    ],
  },
  {
    group: 'USER MANAGEMENT',
    items: [
      { label: 'Người dùng', icon: Users, path: '/users', active: true },
      { label: 'Quản trị viên', icon: UserCog, path: '/admins' },
      { label: 'Khách hàng', icon: Contact, path: '/customers' },
    ],
  },
  {
    group: 'REPORTS & ANALYTICS',
    items: [
      { label: 'Báo cáo doanh số', icon: BarChart3, path: '/reports' },
      { label: 'Phân tích CSV', icon: FileSpreadsheet, path: '/csv-analysis' },
    ],
  },
];

/* ─────────────────────────────────────────────
   Sidebar Component
   ───────────────────────────────────────────── */
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#044b52] border-r border-[#033d45]
          text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[280px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo Header */}
        <div className={`h-[70px] flex items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 min-w-[36px] rounded-xl bg-[#088178] border border-white/20 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-[#ffc107]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-brand text-lg font-black tracking-tight text-white block leading-tight">
                BeautyPals
              </span>
              <span className="font-brand text-[9px] uppercase font-bold tracking-widest text-[#ffc107]/90 block">
                Admin Panel
              </span>
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {sidebarNav.map((section) => (
            <div key={section.group}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-teal-200/60">
                  {section.group}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;
                  return (
                    <li key={item.path}>
                      <button
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200 cursor-pointer
                          ${isActive
                            ? 'bg-white/15 text-white font-bold shadow-xs border border-white/15'
                            : 'text-teal-100/70 hover:bg-white/10 hover:text-white'
                          }
                          ${collapsed ? 'justify-center px-0' : ''}
                        `}
                        title={collapsed ? item.label : ''}
                      >
                        <Icon className={`w-[18px] h-[18px] min-w-[18px] ${isActive ? 'text-[#ffc107]' : 'text-teal-200/70'}`} />
                        {!collapsed && <span>{item.label}</span>}
                        {isActive && !collapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ffc107]" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center border-t border-white/10 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/10 text-teal-200/50 hover:text-white transition-colors cursor-pointer"
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};

/* ─────────────────────────────────────────────
   Top Navigation Bar Component
   ───────────────────────────────────────────── */
const TopNavBar = ({ user, onLogout, onMobileMenuToggle, sidebarCollapsed }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className={`
        sticky top-0 z-30 h-[70px] bg-[#EBF7F5] border-b border-[#d4eae6]
        flex items-center px-4 sm:px-6 gap-4
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
      `}
    >
      {/* Hamburger (Mobile) */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-white/80 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chức năng, người dùng..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-beauty-500/30 focus:border-beauty-500 text-slate-700 placeholder-slate-400 transition-all"
          />
          <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffc107] ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#04535c] to-[#088178] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#088178]/20">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.fullName || 'Người dùng'}
              </div>
              <div className="text-[10px] font-medium text-slate-500 capitalize">
                {user?.role || 'Member'}
              </div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  <UserCircle className="w-4 h-4" />
                  <span>Hồ sơ cá nhân</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Cài đặt</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────
   Stat Card Component (No fake data)
   ───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, subtext, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-[#d4eae6] p-5 flex items-center gap-4 hover:shadow-md hover:border-[#b8e0d9] transition-all duration-200">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-base font-bold text-slate-900 mt-0.5 truncate">{value}</h3>
      <p className="text-[11px] text-slate-400 mt-0.5">{subtext}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Dashboard Page Component
   ───────────────────────────────────────────── */
export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'admin', label: 'Quản trị' },
    { key: 'staff', label: 'Nhân viên' },
    { key: 'customer', label: 'Khách hàng' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF7F5]">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Top Navigation Bar */}
      <TopNavBar
        user={user}
        onLogout={handleLogout}
        onMobileMenuToggle={() => setMobileOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`
          min-h-[calc(100vh-70px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Quản lý Người dùng</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Quản lý Người dùng
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Quản lý tài khoản, phân quyền và theo dõi hoạt động người dùng trên hệ thống BeautyPals.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#088178] to-[#056d6e] text-white text-sm font-semibold shadow-md shadow-[#088178]/20 hover:shadow-lg hover:shadow-[#088178]/30 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Thêm Mới</span>
            </button>
          </div>

          {/* Stats Cards - Real data from AuthContext only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={User}
              label="Tài khoản hiện tại"
              value={user?.fullName || user?.username || '—'}
              subtext={`@${user?.username || '—'}`}
              iconBg="bg-beauty-50"
              iconColor="text-beauty-600"
            />
            <StatCard
              icon={Shield}
              label="Vai trò hệ thống"
              value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
              subtext="Phân quyền hệ thống"
              iconBg="bg-amber-50"
              iconColor="text-[#ffc107]"
            />
            <StatCard
              icon={ShieldCheck}
              label="Trạng thái xác thực"
              value="JWT Active"
              subtext="Token đang hoạt động"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              icon={Database}
              label="Kết nối CSDL"
              value="MySQL"
              subtext="Chờ đồng bộ danh sách"
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>

          {/* Filter Tabs & Search */}
          <div className="bg-white rounded-2xl border border-[#d4eae6] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                      ${activeTab === tab.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lọc theo tên hoặc email..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beauty-500/20 focus:border-beauty-400 text-slate-600 placeholder-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Tài khoản / Email
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Ngày khởi tạo
                    </th>
                    <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current logged-in user row - Real data */}
                  {user && (
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#04535c] to-[#088178] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#088178]/20">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{user.fullName || '—'}</p>
                            <p className="text-[11px] text-slate-400">Tài khoản đang đăng nhập</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700 font-mono">@{user.username || '—'}</p>
                        <p className="text-[11px] text-slate-400">{user.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`
                          inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide
                          ${user.role === 'admin'
                            ? 'bg-[#088178]/10 text-[#088178]'
                            : user.role === 'staff'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }
                        `}>
                          {user.role || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Đang hoạt động
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">{formatDate(user.created_at)}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Empty State - MySQL Ready */}
            <div className="px-6 py-10 text-center border-t border-slate-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
                <Server className="w-7 h-7 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1.5">
                Sẵn sàng kết nối CSDL MySQL
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Hệ thống đã sẵn sàng kết nối CSDL MySQL để truy vấn toàn bộ danh sách người dùng.
                Hiện tại chỉ hiển thị thông tin tài khoản đang đăng nhập. Không nạp dữ liệu mẫu.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-semibold">
                  <Database className="w-3.5 h-3.5" />
                  MySQL Ready
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  JWT Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <span>© 2026 BeautyPals Admin — IS207 Web Application</span>
            <span className="font-mono">v1.0.0 • MySQL • JWT</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
