import React, { useState } from 'react';
import { Sparkles, Film, Palette, Scissors, Sliders, ChevronDown, ChevronUp, ArrowRight, Wand2 } from 'lucide-react';
import { AnimationStyle, AspectRatio, MoodAtmosphere, TargetAiEngine, PromptGenerationRequest } from '../types';

interface PromptFormProps {
  onSubmit: (request: PromptGenerationRequest) => void;
  isLoading: boolean;
}

const SAMPLE_TOPICS = [
  'A lonely lighthouse keeper tending to a fire made of falling stars',
  'Kucing astronot yang menemukan kedai ramen di galaksi donat',
  'Robot pembuat kopi antik yang merawat bunga mawar terakhir di bumi',
  'Tupai koki yang meracik ramuan herbal di hutan bercahaya bioluminescent',
  'Nenek penyihir ramah yang memanggang kue awan hujan manis',
];

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<AnimationStyle>('3d-pixar');
  const [mood, setMood] = useState<MoodAtmosphere>('whimsical');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [targetEngine, setTargetEngine] = useState<TargetAiEngine>('all');
  const [characterDetails, setCharacterDetails] = useState('');
  const [environmentDetails, setEnvironmentDetails] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onSubmit({
      topic: topic.trim(),
      style,
      mood,
      aspectRatio,
      targetEngine,
      characterDetails: characterDetails.trim() || undefined,
      environmentDetails: environmentDetails.trim() || undefined,
    });
  };

  const handleSelectSample = (sample: string) => {
    setTopic(sample);
  };

  return (
    <div id="animation-prompt-form-card" className="bg-[#0a0a0a] rounded-2xl border border-[#222] shadow-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Topik Input */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label htmlFor="topic-input" className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold flex items-center gap-1.5">
              <span>Prompt Topic & Narrative Concept</span>
              <span className="text-blue-500">*</span>
            </label>
            <span className="text-[11px] text-[#555] font-mono">Edge Validated</span>
          </div>

          <div className="relative">
            <textarea
              id="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              rows={3}
              placeholder="e.g. A lonely lighthouse keeper tending to a fire made of falling stars, or seekor kucing astronot di galaksi donat..."
              className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-[#e0e0e0] focus:border-blue-500 outline-none h-32 transition-colors placeholder:text-[#444] resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Quick Idea Pills */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#555] flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Presets:
            </span>
            {SAMPLE_TOPICS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                id={`sample-topic-btn-${idx}`}
                onClick={() => handleSelectSample(sample)}
                className="text-[11px] px-3 py-1 bg-[#111] hover:bg-[#1a1a1a] hover:text-[#fff] hover:border-[#444] text-[#777] rounded-lg font-medium transition-all border border-[#222] cursor-pointer"
              >
                {sample.slice(0, 36)}...
              </button>
            ))}
          </div>
        </div>

        {/* Gaya Animasi Selection (3 Primary Choices: 3D Pixar, Claymation, Scrapbook) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold flex items-center gap-1.5">
              <span>Animation Aesthetic</span>
              <span className="text-blue-500">*</span>
            </label>
            <span className="text-[11px] text-[#555]">Art Direction Preset</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 3D Pixar Option */}
            <button
              type="button"
              id="style-option-3d-pixar"
              onClick={() => setStyle('3d-pixar')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                style === '3d-pixar'
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                  : 'border-[#222] bg-[#111] hover:border-[#333]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    style === '3d-pixar' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-[#181818] text-[#777] border border-[#262626]'
                  }`}>
                    <Film className="w-4 h-4" />
                  </div>
                  {style === '3d-pixar' ? (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      Selected
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#444] uppercase tracking-wider">Preset</span>
                  )}
                </div>
                <h4 className={`text-xs font-bold ${style === '3d-pixar' ? 'text-blue-400' : 'text-[#888] group-hover:text-white'}`}>
                  3D Pixar
                </h4>
                <p className="text-[11px] text-[#777] mt-1 leading-relaxed">
                  Subsurface scattering (SSS), karakter ekspresif, pencahayaan sinematik RenderMan & Octane.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-blue-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Cinematic Glow CGI</span>
              </div>
            </button>

            {/* Claymation Option */}
            <button
              type="button"
              id="style-option-claymation"
              onClick={() => setStyle('claymation')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                style === 'claymation'
                  ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                  : 'border-[#222] bg-[#111] hover:border-[#333]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    style === 'claymation' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[#181818] text-[#777] border border-[#262626]'
                  }`}>
                    <Palette className="w-4 h-4" />
                  </div>
                  {style === 'claymation' ? (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      Selected
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#444] uppercase tracking-wider">Preset</span>
                  )}
                </div>
                <h4 className={`text-xs font-bold ${style === 'claymation' ? 'text-amber-400' : 'text-[#888] group-hover:text-white'}`}>
                  Claymation
                </h4>
                <p className="text-[11px] text-[#777] mt-1 leading-relaxed">
                  Tekstur plastisin fisik, detail jejak sidik jari halus, stop-motion Aardman & Laika Studios.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-amber-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Tactile Stop-Motion</span>
              </div>
            </button>

            {/* Scrapbook Option */}
            <button
              type="button"
              id="style-option-scrapbook"
              onClick={() => setStyle('scrapbook')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                style === 'scrapbook'
                  ? 'border-rose-500/50 bg-rose-500/10 shadow-lg shadow-rose-500/5'
                  : 'border-[#222] bg-[#111] hover:border-[#333]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    style === 'scrapbook' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#181818] text-[#777] border border-[#262626]'
                  }`}>
                    <Scissors className="w-4 h-4" />
                  </div>
                  {style === 'scrapbook' ? (
                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      Selected
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#444] uppercase tracking-wider">Preset</span>
                  )}
                </div>
                <h4 className={`text-xs font-bold ${style === 'scrapbook' ? 'text-rose-400' : 'text-[#888] group-hover:text-white'}`}>
                  Scrapbook
                </h4>
                <p className="text-[11px] text-[#777] mt-1 leading-relaxed">
                  Paper cut-out berlapis, tepi robek artistik, tekstur cardstock & cat air berdimensi bayangan.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-rose-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Collage Texture</span>
              </div>
            </button>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-1">
          <button
            type="button"
            id="toggle-advanced-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-semibold text-[#888] hover:text-[#e0e0e0] flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Pengaturan Lanjutan (Mood, Aspek Rasio, Target AI Engine)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

          {showAdvanced && (
            <div id="advanced-settings-panel" className="mt-3 p-4 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Mood */}
                <div>
                  <label htmlFor="mood-select" className="block text-[10px] uppercase tracking-widest text-[#666] font-bold mb-1.5">
                    Suasana / Mood
                  </label>
                  <select
                    id="mood-select"
                    value={mood}
                    onChange={(e) => setMood(e.target.value as MoodAtmosphere)}
                    className="w-full px-3 py-2 bg-[#111] rounded-lg border border-[#222] text-xs font-medium text-[#e0e0e0] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="whimsical">Ceria & Ajaib (Whimsical)</option>
                    <option value="cinematic">Sinematik & Dramatis</option>
                    <option value="warm-nostalgic">Hangat & Nostalgia</option>
                    <option value="mysterious">Misterius & Magis</option>
                    <option value="action-adventure">Aksi & Petualangan</option>
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label htmlFor="aspect-ratio-select" className="block text-[10px] uppercase tracking-widest text-[#666] font-bold mb-1.5">
                    Aspek Rasio
                  </label>
                  <select
                    id="aspect-ratio-select"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full px-3 py-2 bg-[#111] rounded-lg border border-[#222] text-xs font-medium text-[#e0e0e0] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="16:9">16:9 (Landscape / Layar Lebar)</option>
                    <option value="9:16">9:16 (Vertikal / Reels & TikTok)</option>
                    <option value="1:1">1:1 (Persegi / Square)</option>
                    <option value="21:9">21:9 (CinemaScope Ultrawide)</option>
                    <option value="4:3">4:3 (Classic TV)</option>
                  </select>
                </div>

                {/* Target AI Engine */}
                <div>
                  <label htmlFor="engine-select" className="block text-[10px] uppercase tracking-widest text-[#666] font-bold mb-1.5">
                    Target AI Engine
                  </label>
                  <select
                    id="engine-select"
                    value={targetEngine}
                    onChange={(e) => setTargetEngine(e.target.value as TargetAiEngine)}
                    className="w-full px-3 py-2 bg-[#111] rounded-lg border border-[#222] text-xs font-medium text-[#e0e0e0] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">Semua Engine (Midjourney, Sora, Flux, Runway)</option>
                    <option value="midjourney">Midjourney v6.1 Focus</option>
                    <option value="sora-runway">Sora / Runway Video Focus</option>
                    <option value="flux-sd">Flux.1 / Stable Diffusion XL</option>
                  </select>
                </div>
              </div>

              {/* Optional detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="character-details-input" className="block text-[10px] uppercase tracking-widest text-[#666] font-bold mb-1">
                    Detail Karakter Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    id="character-details-input"
                    value={characterDetails}
                    onChange={(e) => setCharacterDetails(e.target.value)}
                    placeholder="Contoh: Mata biru bulat besar, syal rajut merah..."
                    className="w-full px-3 py-2 bg-[#111] rounded-lg border border-[#222] text-xs text-[#e0e0e0] placeholder:text-[#444] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="env-details-input" className="block text-[10px] uppercase tracking-widest text-[#666] font-bold mb-1">
                    Detail Latar / Environment (Opsional)
                  </label>
                  <input
                    type="text"
                    id="env-details-input"
                    value={environmentDetails}
                    onChange={(e) => setEnvironmentDetails(e.target.value)}
                    placeholder="Contoh: Interior kayu hangat dengan lentera gantung..."
                    className="w-full px-3 py-2 bg-[#111] rounded-lg border border-[#222] text-xs text-[#e0e0e0] placeholder:text-[#444] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-prompt-submit-btn"
            disabled={isLoading || !topic.trim()}
            className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-slate-200 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Compiling Edge SSR Prompt...</span>
              </>
            ) : (
              <>
                <span>Compile Edge Prompt ({style === '3d-pixar' ? '3D Pixar' : style === 'claymation' ? 'Claymation' : 'Scrapbook'})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
