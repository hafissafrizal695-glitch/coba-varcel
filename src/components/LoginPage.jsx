import React, { useState, useEffect, useCallback } from 'react';
import './LoginPage.css';

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'login-toast-success', icon: '✔️' },
    error: { bg: 'login-toast-error', icon: '❌' },
    info: { bg: 'login-toast-info', icon: 'ℹ️' },
  };

  const { bg, icon } = config[type] || config.info;

  return (
    <div className={`login-toast ${bg}`}>
      <span style={{ marginRight: '12px', fontSize: '18px' }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function LoginPage({ onLoginSuccess }) {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [toast, setToast] = useState(null);

  // Admin form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // User form
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // Handle Admin Login
  const handleAdminLogin = useCallback((e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setToast({ message: `Berhasil masuk ke Dashboard Admin (${adminEmail})!`, type: 'success' });
      setTimeout(() => onLoginSuccess('admin'), 500);
    } else {
      setToast({ message: 'Email dan password harus diisi!', type: 'error' });
    }
  }, [adminEmail, adminPassword, onLoginSuccess]);

  // Handle User Login
  const handleUserLogin = useCallback((e) => {
    e.preventDefault();
    if (userEmail && userPassword) {
      setToast({ message: `Berhasil masuk ke Portal Karir (${userEmail})!`, type: 'success' });
      setTimeout(() => onLoginSuccess('user'), 500);
    } else {
      setToast({ message: 'Email dan password harus diisi!', type: 'error' });
    }
  }, [userEmail, userPassword, onLoginSuccess]);

  // Toggle panel
  const togglePanel = (isAdmin) => setIsAdminActive(isAdmin);

  // Info notification
  const showInfo = (msg) => setToast({ message: msg, type: 'info' });

  return (
    <div className="login-page-bg">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Container - di tengah layar */}
      <div className={`login-container ${isAdminActive ? 'admin-panel-active' : ''}`}>

        {/* ── FORM ADMIN (KIRI) ── */}
        <div className="login-form-container admin-container">
          <form onSubmit={handleAdminLogin}>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#901d31] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-extrabold text-[#901d31] tracking-wide text-lg">
                Skill<span className="text-[#f5a623]">Shift</span>
              </span>
              <span className="text-[10px] bg-red-100 text-[#901d31] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#2d1b1f] mb-1">Akses Administrator</h1>
            <p className="text-gray-400 text-xs mb-6">
              Masuk untuk mengelola lowongan dan meninjau pelamar kerja.
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <input
                type="email"
                placeholder="admin@skillshift.com"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f6] border border-gray-100 focus:border-[#901d31] rounded-xl text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f6] border border-gray-100 focus:border-[#901d31] rounded-xl text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Lupa Password */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={() => showInfo('Portal pemulihan admin sedang disiapkan.')}
                className="text-xs text-gray-400 hover:text-[#901d31] transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#4c0519] hover:bg-[#901d31] text-white font-semibold rounded-xl text-sm shadow-md transition-all duration-300 active:scale-[0.98]"
            >
              Masuk Dasbor Admin
            </button>

            {/* Link Mobile */}
            <p className="text-center text-xs text-gray-500 mt-6 md:hidden">
              Bukan administrator?
              <button type="button" onClick={() => togglePanel(false)} className="text-[#901d31] font-semibold underline ml-1">
                Portal User
              </button>
            </p>
          </form>
        </div>

        {/* ── FORM USER (KANAN) ── */}
        <div className="login-form-container user-container">
          <form onSubmit={handleUserLogin}>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#901d31] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-extrabold text-[#901d31] tracking-wide text-lg">
                Skill<span className="text-[#f5a623]">Shift</span>
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Talent
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#2d1b1f] mb-1">Cari Kerja Impianmu</h1>
            <p className="text-gray-400 text-xs mb-6">
              Masuk untuk melamar pekerjaan kreatif dan magang terbaik.
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email Pengguna
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f6] border border-gray-100 focus:border-[#901d31] rounded-xl text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f6] border border-gray-100 focus:border-[#901d31] rounded-xl text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Lupa Password */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={() => showInfo('Portal pemulihan akun user akan segera hadir.')}
                className="text-xs text-gray-400 hover:text-[#901d31] transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#901d31] hover:bg-[#b0273f] text-white font-semibold rounded-xl text-sm shadow-md transition-all duration-300 active:scale-[0.98]"
            >
              Masuk Sekarang
            </button>

            {/* Link Mobile */}
            <p className="text-center text-xs text-gray-500 mt-6 md:hidden">
              Memiliki akun Admin?
              <button type="button" onClick={() => togglePanel(true)} className="text-[#901d31] font-semibold underline ml-1">
                Portal Admin
              </button>
            </p>
          </form>
        </div>

        {/* ── OVERLAY (SLIDING PANEL) ── */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Panel Kiri */}
            <div className="overlay-panel overlay-left">
              <h1 className="text-3xl font-extrabold mb-3">Kembali ke User</h1>
              <p className="text-sm text-red-100 font-light mb-8 max-w-[280px]">
                Ingin melamar pekerjaan terbaru atau mengelola resume pribadi Anda?
              </p>
              <button
                onClick={() => togglePanel(false)}
                className="px-10 py-3 border-2 border-white text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-[#901d31] transition-all duration-300 shadow-md"
              >
                Portal User
              </button>
            </div>

            {/* Panel Kanan */}
            <div className="overlay-panel overlay-right">
              <h1 className="text-3xl font-extrabold mb-3">Portal Admin</h1>
              <p className="text-sm text-red-100 font-light mb-8 max-w-[280px]">
                Gunakan dashboard admin khusus untuk mempublikasikan dan menyaring lowongan kerja.
              </p>
              <button
                onClick={() => togglePanel(true)}
                className="px-10 py-3 border-2 border-white text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-[#901d31] transition-all duration-300 shadow-md"
              >
                Portal Admin
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
