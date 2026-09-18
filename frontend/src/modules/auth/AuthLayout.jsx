import React from 'react';
import { Sparkles } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-stretch bg-[#EBF7F5]">
      {/* Left Brand Panel (Deep Rich Teal, centered logo, brand name, and slogan) */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#044b52] text-white p-12 flex-col justify-between">
        {/* Soft decorative background circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#088178]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-[#ffc107]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#056d6e]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Top spacer */}
        <div className="relative z-10" />

        {/* Center Logo, Brand Name & Slogan */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md mx-auto my-auto">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#088178] to-[#0a9b90] border-2 border-white/20 flex items-center justify-center shadow-2xl shadow-black/25 transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-14 h-14 text-[#ffc107]" />
          </div>

          <div className="space-y-3">
            <h1 className="font-brand text-5xl font-black tracking-tight text-white drop-shadow-sm">
              BeautyPals
            </h1>
            <p className="font-brand text-xs uppercase font-bold tracking-[0.25em] text-[#ffc107]">
              Cosmetics Management Platform
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-teal-200/60 flex items-center justify-between border-t border-white/10 pt-6">
          <span>© 2026 BeautyPals Inc. All rights reserved.</span>
          <span className="font-mono text-[#ffc107] font-semibold">IS207 - Web App</span>
        </div>
      </div>

      {/* Right Form Container (Pastel soft teal background, 100% mobile, 52% desktop) */}
      <div className="w-full lg:w-[52%] flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#EBF7F5]">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#044b52] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-[#ffc107]" />
            </div>
            <div>
              <span className="font-brand text-xl font-black text-slate-900 block">BeautyPals</span>
              <span className="font-brand block text-[9px] uppercase font-bold text-[#088178]">Cosmetics Management</span>
            </div>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card Content */}
          <div className="rounded-3xl p-6 sm:p-8 shadow-xl bg-white border border-[#d4eae6]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
