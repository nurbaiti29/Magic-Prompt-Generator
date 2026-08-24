import React, { useState } from 'react';
import { Sparkles, Code2, ShieldAlert, Cpu, Film, Palette, Scissors, Layers, CheckCircle2, Terminal, AlertCircle, ArrowUpRight, Lock, Server } from 'lucide-react';
import { PromptForm } from './components/PromptForm';
import { PromptResultView } from './components/PromptResultView';
import { AstroProjectViewer } from './components/AstroProjectViewer';
import { SecurityBadge } from './components/SecurityBadge';
import { PromptGenerationRequest, PromptGenerationResponse } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'code-suite' | 'security-guide'>('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptGenerationResponse | null>(null);
  const [history, setHistory] = useState<PromptGenerationResponse[]>([]);

  const handleGeneratePrompt = async (req: PromptGenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses permintaan di server.');
      }

      setResult(data);
      setHistory((prev) => [data, ...prev.slice(0, 5)]);

      // Scroll to result view
      setTimeout(() => {
        const resultEl = document.getElementById('prompt-generation-result-container');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error generating prompt:', err);
      setError(err.message || 'Gagal terhubung ke API Route server-side.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-blue-500/30 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#222] px-4 sm:px-8">
          <div className="max-w-6xl mx-auto py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic shadow-md shadow-blue-600/20">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-white">
                    Astro <span className="text-blue-500">SSR</span> Animator
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 font-mono">
                    Cloudflare Edge
                  </span>
                </div>
                <p className="text-[11px] text-[#666] hidden md:block">
                  Secure Server-Side Prompt Generation Engine • No Client Leakage
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#666] font-mono pr-2 border-r border-[#222]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Workers Active</span>
              </div>

              <nav className="flex items-center bg-[#111] p-1 rounded-xl border border-[#222] text-xs font-semibold">
                <button
                  type="button"
                  id="tab-generator-btn"
                  onClick={() => setActiveTab('generator')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'generator'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-[#888] hover:text-[#e0e0e0]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Generator</span>
                </button>

                <button
                  type="button"
                  id="tab-code-suite-btn"
                  onClick={() => setActiveTab('code-suite')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'code-suite'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-[#888] hover:text-[#e0e0e0]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </button>

                <button
                  type="button"
                  id="tab-security-guide-btn"
                  onClick={() => setActiveTab('security-guide')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'security-guide'
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-[#888] hover:text-[#e0e0e0]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Security Architecture</span>
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-8">
          {/* Security Summary Badge */}
          <SecurityBadge />

          {/* TAB 1: Live Generator Form */}
          {activeTab === 'generator' && (
            <div className="space-y-8">
              {/* Header intro */}
              <div className="text-center max-w-2xl mx-auto pt-2">
                <h2 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">
                  Vision to Prompt
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#777] leading-relaxed">
                  Enter a concept and select a visual direction for your AI generation. System instructions and art direction rules are executed strictly on the Cloudflare Edge server.
                </p>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-start gap-3 text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-200">Execution Error</h4>
                    <p className="text-rose-400/90 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Form Component */}
              <PromptForm onSubmit={handleGeneratePrompt} isLoading={isLoading} />

              {/* Result View */}
              {result && <PromptResultView result={result} />}

              {/* History of recent generations */}
              {history.length > 1 && (
                <div className="pt-6 border-t border-[#1a1a1a]">
                  <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] mb-3">
                    Recent Session History
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {history.slice(1).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setResult(item)}
                        className="p-3.5 bg-[#0a0a0a] rounded-xl border border-[#222] text-left hover:border-blue-500/50 hover:bg-[#111] transition-all cursor-pointer group"
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111] rounded text-[#888] group-hover:text-blue-400 border border-[#222]">
                          {item.styleDisplayName || item.style}
                        </span>
                        <h4 className="text-xs font-bold text-[#e0e0e0] mt-2 truncate">
                          {item.topic}
                        </h4>
                        <p className="text-[11px] font-mono text-[#666] mt-1 line-clamp-2">
                          {item.masterImagePrompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Astro.js Code Suite */}
          {activeTab === 'code-suite' && (
            <div className="space-y-6">
              <AstroProjectViewer />
            </div>
          )}

          {/* TAB 3: Security & Deployment Guide */}
          {activeTab === 'security-guide' && (
            <div className="space-y-8">
              <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 sm:p-8 shadow-2xl space-y-8">
                <div>
                  <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase rounded tracking-widest">
                    Security Architecture Analysis
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight mt-2">
                    How System Prompt Formulas Are Protected from Browser Leaks
                  </h2>
                  <p className="text-xs sm:text-sm text-[#777] mt-2 leading-relaxed">
                    Most standard client-side AI applications inadvertently expose their private prompt formulas in the browser Network tab. Astro.js SSR with Cloudflare Workers isolates the entire Gemini generation flow on the secure edge runtime:
                  </p>
                </div>

                {/* 3 Pillars of Security */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
                    <div className="text-xs text-blue-400 font-mono font-bold mb-1.5 flex items-center gap-1.5">
                      <Server className="w-4 h-4" />
                      <span>SSR Pipeline (output: 'server')</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#888] mt-2">
                      The Astro.js endpoint <code className="text-[#bbb] bg-black px-1.5 py-0.5 rounded font-mono border border-[#222]">/api/generate-prompt</code> executes exclusively on Cloudflare Workers, eliminating direct client API calls.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
                    <div className="text-xs text-amber-400 font-mono font-bold mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      <span>Zero Public Secret Exposure</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#888] mt-2">
                      <code className="text-[#bbb] bg-black px-1.5 py-0.5 rounded font-mono border border-[#222]">GEMINI_API_KEY</code> and system prompt formulas have no <code className="text-rose-400 font-mono">PUBLIC_</code> prefix, preventing Vite from bunding them into client JS.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
                    <div className="text-xs text-emerald-400 font-mono font-bold mb-1.5 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>Structured JSON Sanitization</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#888] mt-2">
                      The edge handler enforces schema contracts with Gemini AI and returns sanitized payload structures only. Internal prompt engineering remains completely hidden.
                    </p>
                  </div>
                </div>

                {/* Deployment Checklist to Cloudflare Workers */}
                <div className="pt-6 border-t border-[#1a1a1a]">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Cloudflare Workers Production Deployment
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 bg-[#000] border border-[#1a1a1a] rounded-xl">
                      <p className="text-[#666] mb-1 font-sans text-[11px] font-semibold">1. Install Node.js Dependencies:</p>
                      <code className="text-emerald-400 select-all">npm install</code>
                    </div>

                    <div className="p-3.5 bg-[#000] border border-[#1a1a1a] rounded-xl">
                      <p className="text-[#666] mb-1 font-sans text-[11px] font-semibold">2. Provision Server Secret in Cloudflare:</p>
                      <code className="text-emerald-400 block select-all">npx wrangler secret put GEMINI_API_KEY</code>
                      <span className="text-[#555] text-[10px] block mt-1"># Enter your Google AI Studio Gemini API Key</span>
                    </div>

                    <div className="p-3.5 bg-[#000] border border-[#1a1a1a] rounded-xl">
                      <p className="text-[#666] mb-1 font-sans text-[11px] font-semibold">3. Compile & Deploy to Global Edge:</p>
                      <code className="text-emerald-400 select-all">npm run deploy</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-[#050505] border-t border-[#1a1a1a] px-4 sm:px-8 flex items-center justify-between text-[10px] text-[#555] uppercase tracking-widest font-mono">
        <span>© Astro SSR Animator • Gemini Edge Forge</span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Region: Cloudflare Global Edge</span>
          <span>v4.12.0</span>
        </div>
      </footer>
    </div>
  );
}
