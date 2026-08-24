import React, { useState } from 'react';
import { Copy, Check, Sparkles, Video, Image as ImageIcon, Camera, Clapperboard, Music, Lightbulb, Palette, AlertCircle, Terminal, Layers } from 'lucide-react';
import { PromptGenerationResponse } from '../types';

interface PromptResultViewProps {
  result: PromptGenerationResponse;
}

export const PromptResultView: React.FC<PromptResultViewProps> = ({ result }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStyleBadgeColor = (style: string) => {
    switch (style) {
      case '3d-pixar':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'claymation':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'scrapbook':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-[#111] text-[#888] border-[#222]';
    }
  };

  return (
    <div id="prompt-generation-result-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SSR Edge Generated
            </span>
            <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getStyleBadgeColor(result.style)}`}>
              {result.styleDisplayName || result.style}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight">
            &ldquo;{result.topic}&rdquo;
          </h2>
          <p className="text-[11px] text-[#777] mt-1 font-mono">
            Generated securely via Cloudflare Workers SSR Edge API • Zero prompt engineering exposed
          </p>
        </div>

        <button
          type="button"
          id="copy-all-master-btn"
          onClick={() => copyToClipboard(result.masterImagePrompt, 'master-all')}
          className="px-4 py-2.5 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          {copiedKey === 'master-all' ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Master Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Master Image Prompt Card */}
      <div id="card-master-image-prompt" className="bg-[#000] text-white rounded-2xl border border-[#1a1a1a] p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e0e0e0] uppercase tracking-wider">Master Image Prompt (Midjourney / Flux / DALL-E)</h3>
              <p className="text-[11px] text-[#666]">Primary visual prompt with art direction, volumetric lighting, and camera optics</p>
            </div>
          </div>

          <button
            type="button"
            id="copy-master-prompt-btn"
            onClick={() => copyToClipboard(result.masterImagePrompt, 'master-prompt')}
            className="p-2 bg-[#111] hover:bg-[#1a1a1a] text-[#888] hover:text-white rounded-xl transition-all border border-[#222] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'master-prompt' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedKey === 'master-prompt' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 bg-[#080808] rounded-xl border border-[#1a1a1a] text-xs sm:text-sm font-mono text-[#e0e0e0] leading-relaxed tracking-normal select-text">
          {result.masterImagePrompt}
        </div>

        {/* Midjourney CLI Command */}
        {result.midjourneySyntax && (
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Midjourney CLI Syntax (/imagine)
              </span>
              <button
                type="button"
                id="copy-midjourney-syntax-btn"
                onClick={() => copyToClipboard(result.midjourneySyntax, 'mj-syntax')}
                className="text-xs text-[#666] hover:text-blue-300 font-mono transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'mj-syntax' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Command</span>
              </button>
            </div>
            <div className="p-3 bg-[#080808] rounded-xl border border-[#1a1a1a] text-xs font-mono text-blue-300/90 break-all select-text">
              {result.midjourneySyntax}
            </div>
          </div>
        )}
      </div>

      {/* 2. Video / Motion Animation Prompt Card */}
      <div id="card-video-motion-prompt" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e0e0e0] uppercase tracking-wider">Video & Motion Prompt (Sora / Runway Gen-3 / Kling)</h3>
              <p className="text-[11px] text-[#666]">Camera kinematics, subject dynamics, and temporal progression</p>
            </div>
          </div>

          <button
            type="button"
            id="copy-video-prompt-btn"
            onClick={() => copyToClipboard(result.videoMotionPrompt, 'video-prompt')}
            className="p-2 bg-[#111] hover:bg-[#1a1a1a] text-[#888] hover:text-white rounded-xl transition-all border border-[#222] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'video-prompt' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedKey === 'video-prompt' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] text-xs sm:text-sm font-mono text-[#ccc] leading-relaxed select-text">
          {result.videoMotionPrompt}
        </div>
      </div>

      {/* 3. Technical Specs (Lighting, Color, Camera) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lighting & Palette */}
        <div id="card-lighting-specs" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">Lighting & Color Grading</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Lighting Setup:</span>
              <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#1a1a1a] font-mono leading-relaxed">
                {result.lightingAndColor?.lightingSetup || 'Three-point studio lighting with warm rim light'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Atmosphere:</span>
              <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#1a1a1a] font-mono leading-relaxed">
                {result.lightingAndColor?.atmosphere || 'Whimsical and vibrant atmosphere'}
              </p>
            </div>

            {result.lightingAndColor?.colorPalette && result.lightingAndColor.colorPalette.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#555]" />
                  Color Palette Swatches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.lightingAndColor.colorPalette.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#111] text-[#ccc] rounded-lg border border-[#222] font-mono text-[11px] flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400/80" />
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera & Lens Specs */}
        <div id="card-camera-specs" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">Optics & Engine Shader</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Lens Profile:</span>
                <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#1a1a1a] font-mono">
                  {result.cameraSpecs?.lens || '50mm f/2.0 Prime'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Depth of Field:</span>
                <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#1a1a1a] font-mono">
                  {result.cameraSpecs?.depthOfField || 'Shallow DoF with soft bokeh'}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Framing & Geometry:</span>
              <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#1a1a1a] font-mono leading-relaxed">
                {result.cameraSpecs?.framing || 'Medium close-up shot, rule of thirds'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold block mb-1">Signature Render Shader:</span>
              <p className="text-blue-300 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 font-mono text-[11px]">
                {result.cameraSpecs?.renderEngineStyle || 'RenderMan Octane 3D SSS'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Storyboard 4-Beat Scene Breakdown */}
      {result.storyboard && result.storyboard.length > 0 && (
        <div id="card-storyboard-breakdown" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e0e0e0] uppercase tracking-wider">4-Scene Animation Storyboard Breakdown</h3>
              <p className="text-[11px] text-[#666]">Sequential narrative sequence for micro-animation production</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.storyboard.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-4 rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] flex flex-col justify-between hover:border-[#333] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-[#1a1a1a] text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-500/20">
                      Scene 0{scene.sceneNumber}: {scene.shotTitle}
                    </span>
                    <span className="text-[10px] font-mono text-[#666] bg-[#050505] px-2 py-0.5 rounded border border-[#1a1a1a]">
                      {scene.cameraAngle}
                    </span>
                  </div>

                  <p className="text-xs text-[#ddd] mt-2 leading-relaxed font-mono">
                    {scene.visualPrompt}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#1a1a1a] text-[11px] text-[#888]">
                    <span className="text-blue-400 font-semibold">Motion: </span>
                    {scene.motionPrompt}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center gap-1.5 text-[10px] text-purple-400 font-mono">
                  <Music className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">SFX: {scene.soundSfx}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Negative Prompt & Director Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Negative Prompt */}
        <div id="card-negative-prompt" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">Negative Prompt Filter</h4>
            </div>
            <button
              type="button"
              id="copy-negative-prompt-btn"
              onClick={() => copyToClipboard(result.negativePrompt, 'negative-prompt')}
              className="text-xs text-[#666] hover:text-rose-400 flex items-center gap-1 cursor-pointer font-mono"
            >
              {copiedKey === 'negative-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <p className="text-xs text-[#888] bg-[#0d0d0d] p-3 rounded-xl border border-rose-500/20 font-mono leading-relaxed select-text">
            {result.negativePrompt || 'photorealistic human, uncanny valley, watermark, low quality, artifacts, flat lighting'}
          </p>
        </div>

        {/* Audio Concept */}
        <div id="card-audio-concept" className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">Audio & Soundtrack Direction</h4>
          </div>
          <p className="text-xs text-[#888] bg-[#0d0d0d] p-3 rounded-xl border border-amber-500/20 font-mono leading-relaxed">
            {result.soundConcept || 'Orchestral whimsical soundtrack with playful woodwinds and subtle ambient sound effects.'}
          </p>
        </div>
      </div>

      {/* 6. Creative Director Notes */}
      {result.creativeNotes && (
        <div id="card-creative-notes" className="bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a] text-white rounded-2xl p-6 sm:p-7 border border-blue-500/20 shadow-2xl">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Art Director Synthesis & Execution Strategy
          </h4>
          <p className="text-xs sm:text-sm text-[#bbb] leading-relaxed font-sans">
            {result.creativeNotes}
          </p>
        </div>
      )}
    </div>
  );
};
