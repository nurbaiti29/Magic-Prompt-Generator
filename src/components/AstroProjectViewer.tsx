import React, { useState } from 'react';
import { FileCode, Download, Copy, Check, Terminal, ExternalLink, ShieldCheck, Folder, FileText } from 'lucide-react';
import JSZip from 'jszip';
import { ASTRO_PROJECT_FILES } from '../astroProjectFiles';
import { AstroFileItem } from '../types';

export const AstroProjectViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AstroFileItem>(ASTRO_PROJECT_FILES[2]); // Default to generate-prompt.ts
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into zip structure
      ASTRO_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'astro-cloudflare-animation-prompter.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div id="astro-project-suite-viewer" className="space-y-6">
      {/* Header with Download & Summary */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest mb-2">
            <span>Astro.js SSR • Cloudflare Workers Adapter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight">
            Struktur Source Code Proyek Astro.js
          </h2>
          <p className="text-xs text-[#777] mt-1 max-w-2xl font-sans leading-relaxed">
            Semua file arsitektur siap dideploy ke Cloudflare Workers. Mode SSR memastikan API Route mengunci instruksi dan formula prompt dengan aman di sisi server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="download-astro-zip-btn"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-200 text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95 transition-all cursor-pointer"
          >
            {isZipping ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Creating ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Proyek (.zip)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Inspector (Sidebar + Code Editor) */}
      <div className="bg-[#000] rounded-2xl border border-[#1a1a1a] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* File Tree Navigation Sidebar */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#080808] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2 text-[#888] font-bold text-[10px] uppercase tracking-[0.2em]">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span>Project Files</span>
              </div>
              <span className="text-[10px] font-mono text-[#555]">{ASTRO_PROJECT_FILES.length} Files</span>
            </div>

            <div className="space-y-1">
              {ASTRO_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    id={`file-tree-item-${file.filename.replace('.', '-')}`}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold'
                        : 'text-[#777] hover:text-[#e0e0e0] hover:bg-[#111] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.filename.endsWith('.ts') || file.filename.endsWith('.mjs') ? (
                        <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : file.filename.endsWith('.astro') ? (
                        <FileCode className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      ) : file.filename.endsWith('.json') || file.filename.endsWith('.jsonc') ? (
                        <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{file.path}</span>
                    </div>
                    {file.path.includes('generate-prompt') && (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold bg-rose-500/20 text-rose-300 rounded border border-rose-500/30 shrink-0">
                        SSR API
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick CLI tip */}
          <div className="mt-6 pt-4 border-t border-[#1a1a1a] bg-[#050505] p-3 rounded-xl border border-[#1a1a1a]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#888] mb-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Deploy to Cloudflare Edge:</span>
            </div>
            <code className="text-[11px] font-mono text-emerald-400/90 block bg-[#000] px-2.5 py-1.5 rounded border border-[#1a1a1a] select-all">
              npm run deploy
            </code>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between bg-[#000]">
          <div>
            {/* File info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#1a1a1a] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono font-bold text-blue-300">{selectedFile.path}</span>
                  <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-[#111] text-[#888] rounded border border-[#222]">
                    {selectedFile.language}
                  </span>
                </div>
                <p className="text-[11px] text-[#666] mt-1">{selectedFile.description}</p>
              </div>

              <button
                type="button"
                id="copy-selected-code-btn"
                onClick={() => handleCopyCode(selectedFile.code, selectedFile.path)}
                className="px-3 py-1.5 bg-[#111] hover:bg-[#1a1a1a] text-[#888] hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#222] transition-all cursor-pointer self-start sm:self-auto font-mono"
              >
                {copiedKey === selectedFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="relative">
              <pre className="p-4 bg-[#080808] rounded-xl border border-[#1a1a1a] text-xs font-mono text-[#d4d4d4] overflow-x-auto max-h-[420px] leading-relaxed select-text">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>

          {/* Footer note on security */}
          <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-[#555]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configured for @astrojs/cloudflare adapter in SSR mode</span>
            </div>
            <span className="font-mono text-[10px] text-[#444]">{selectedFile.code.split('\n').length} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};
