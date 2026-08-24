import React from 'react';
import { ShieldCheck, Lock, Server, Cloud, Cpu, ArrowRight } from 'lucide-react';

export const SecurityBadge: React.FC = () => {
  return (
    <div id="security-architecture-badge" className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-5 text-[#e0e0e0] shadow-2xl relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-[0.15em]">
                Arsitektur Keamanan SSR & Cloudflare Edge
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                Edge Verified
              </span>
            </div>
            <p className="text-[11px] text-[#888] mt-0.5 leading-relaxed">
              Formula prompt rahasia & API Key tersimpan di server Cloudflare Workers. Browser hanya menerima payload JSON terstruktur.
            </p>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 text-[11px] font-mono bg-[#050505] px-3.5 py-2.5 rounded-xl border border-[#1a1a1a]">
          <div className="flex items-center gap-1.5 text-[#888]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>Browser UI</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444] shrink-0" />
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>SSR /api/generate-prompt</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#444] shrink-0" />
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
