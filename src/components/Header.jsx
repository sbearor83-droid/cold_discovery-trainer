import React from 'react';
import { PhoneCall, Settings, Mic, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header({ onOpenSettings, isCallActive }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">CallCraft AI</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                BILL AE Trainer
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Accounting Channel</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Accounting & Property Mgmt ICPs</span>
            </div>
          </div>
        </div>

        {/* Status & Settings Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Live Voice Engine Ready</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
