import { AstroFileItem } from './types';

export const ASTRO_PROJECT_FILES: AstroFileItem[] = [
  {
    filename: 'astro.config.mjs',
    path: 'astro.config.mjs',
    language: 'javascript',
    description: 'Konfigurasi Astro dengan output: "server" dan Cloudflare Workers adapter',
    code: `import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Server-Side Rendering (SSR) mode
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    tailwind({
      applyBaseStyles: true
    })
  ]
});`,
  },
  {
    filename: 'wrangler.jsonc',
    path: 'wrangler.jsonc',
    language: 'json',
    description: 'Konfigurasi Cloudflare Workers (Wrangler) dengan nodejs_compat',
    code: `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "astro-animation-prompter",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2024-11-01",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  }
  // Secrets (GEMINI_API_KEY & SYSTEM_PROMPT_SECRET_FORMULA) dimasukkan via:
  // npx wrangler secret put GEMINI_API_KEY
  // npx wrangler secret put SYSTEM_PROMPT_SECRET_FORMULA
}`,
  },
  {
    filename: 'generate-prompt.ts',
    path: 'src/pages/api/generate-prompt.ts',
    language: 'typescript',
    description: 'API Route SSR (/api/generate-prompt) yang memanggil Gemini API & mengunci system prompt rahasia di server',
    code: `import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';

// Wajib untuk SSR di Astro
export const prerender = false;

// Default System Prompt Formula (disimpan di server-side, tidak pernah dikirim ke browser)
const DEFAULT_SECRET_SYSTEM_PROMPT = \`
You are the World's Premier Animation Art Director and Prompt Engineering Architect.
Specialize in ultra-high fidelity animation prompts for AI generators (Midjourney v6, Flux.1, Sora, Runway Gen-3).

ART DIRECTION RULES BY STYLE:
1. 3D Pixar: Subsurface scattering on skin/cloth, expressive squash-and-stretch, Pixar RenderMan bounce lighting, warm rim light (5600K key, 3200K fill), 8k octane render.
2. Claymation: Real plasticine clay textures, visible tiny fingerprint impressions, Aardman/Laika aesthetic, tabletop miniature lighting, 50mm macro lens.
3. Scrapbook: Multi-layered cut paper art, torn deckled edges, textured cardstock, shadowbox depth of field with cast shadows, gouache/watercolor textures.

Output strictly valid JSON with masterImagePrompt, videoMotionPrompt, midjourneySyntax, fluxPrompt, negativePrompt, lightingAndColor, cameraSpecs, storyboard, creativeNotes, soundConcept.
\`;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { topic, style = '3d-pixar', mood = 'whimsical', aspectRatio = '16:9' } = body;

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return new Response(JSON.stringify({ success: false, error: 'Topic is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ambil API Key dan System Prompt dari Cloudflare Workers env (locals.runtime.env) atau process.env
    // Formula rahasia tidak pernah terekspos ke browser
    const env = (locals as any)?.runtime?.env || process.env;
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const systemPrompt = env.SYSTEM_PROMPT_SECRET_FORMULA || DEFAULT_SECRET_SYSTEM_PROMPT;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'GEMINI_API_KEY is not configured on Cloudflare Workers environment variables.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = \`
Topik: "\${topic.trim()}"
Gaya Animasi: "\${style}"
Suasana/Mood: "\${mood}"
Aspek Rasio: "\${aspectRatio}"
Generate production-ready animation prompt suite according to the secret formula.\`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            topic: { type: Type.STRING },
            style: { type: Type.STRING },
            styleDisplayName: { type: Type.STRING },
            masterImagePrompt: { type: Type.STRING },
            videoMotionPrompt: { type: Type.STRING },
            midjourneySyntax: { type: Type.STRING },
            fluxPrompt: { type: Type.STRING },
            negativePrompt: { type: Type.STRING },
            lightingAndColor: {
              type: Type.OBJECT,
              properties: {
                lightingSetup: { type: Type.STRING },
                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                atmosphere: { type: Type.STRING },
              },
              required: ['lightingSetup', 'colorPalette', 'atmosphere'],
            },
            cameraSpecs: {
              type: Type.OBJECT,
              properties: {
                lens: { type: Type.STRING },
                depthOfField: { type: Type.STRING },
                framing: { type: Type.STRING },
                renderEngineStyle: { type: Type.STRING },
              },
              required: ['lens', 'depthOfField', 'framing', 'renderEngineStyle'],
            },
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  shotTitle: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  motionPrompt: { type: Type.STRING },
                  soundSfx: { type: Type.STRING },
                },
                required: ['sceneNumber', 'shotTitle', 'cameraAngle', 'visualPrompt', 'motionPrompt', 'soundSfx'],
              },
            },
            creativeNotes: { type: Type.STRING },
            soundConcept: { type: Type.STRING },
          },
          required: [
            'topic',
            'style',
            'styleDisplayName',
            'masterImagePrompt',
            'videoMotionPrompt',
            'midjourneySyntax',
            'negativePrompt',
            'lightingAndColor',
            'cameraSpecs',
            'storyboard',
            'creativeNotes',
            'soundConcept',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return new Response(
      JSON.stringify({
        success: true,
        topic,
        style,
        ...parsed,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Server error processing prompt',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};`,
  },
  {
    filename: 'index.astro',
    path: 'src/pages/index.astro',
    language: 'html',
    description: 'Halaman Utama Astro dengan Form Input (Topik & Gaya Animasi: 3D Pixar, Claymation, Scrapbook)',
    code: `---
import Layout from '../layouts/Layout.astro';

// SSR Page
export const prerender = false;
---

<Layout title="Astro AI Animation Prompt Generator">
  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- Header -->
    <header class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
        <span>⚡ Astro SSR + Cloudflare Workers</span>
      </div>
      <h1 class="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
        AI Animation Prompt Architect
      </h1>
      <p class="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        Buat formula prompt animasi profesional (3D Pixar, Claymation, Scrapbook). Formula prompt terlindungi aman di server-side API Route.
      </p>
    </header>

    <!-- Interactive Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-8">
      <form id="prompt-form" class="space-y-6">
        <!-- Topik Input -->
        <div>
          <label for="topic" class="block text-sm font-bold text-slate-800 mb-2">
            Topik / Ide Cerita Animasi <span class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            placeholder="Contoh: Kucing astronot yang menemukan kedai ramen di luar angkasa"
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>

        <!-- Gaya Animasi (Radio Cards) -->
        <div>
          <label class="block text-sm font-bold text-slate-800 mb-3">
            Pilih Gaya Animasi <span class="text-rose-500">*</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- 3D Pixar -->
            <label class="relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-200 hover:border-amber-400 bg-slate-50/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/40">
              <input type="radio" name="style" value="3d-pixar" checked class="sr-only" />
              <span class="text-2xl mb-2">✨</span>
              <span class="font-bold text-slate-900">3D Pixar</span>
              <span class="text-xs text-slate-500 mt-1">RenderMan SSS, ekspresif, pencahayaan sinematik Disney/Pixar</span>
            </label>

            <!-- Claymation -->
            <label class="relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-200 hover:border-amber-400 bg-slate-50/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/40">
              <input type="radio" name="style" value="claymation" class="sr-only" />
              <span class="text-2xl mb-2">🎨</span>
              <span class="font-bold text-slate-900">Claymation</span>
              <span class="text-xs text-slate-500 mt-1">Tekstur plastisin, jejak sidik jari, stop-motion Aardman/Laika</span>
            </label>

            <!-- Scrapbook -->
            <label class="relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all border-slate-200 hover:border-amber-400 bg-slate-50/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/40">
              <input type="radio" name="style" value="scrapbook" class="sr-only" />
              <span class="text-2xl mb-2">✂️</span>
              <span class="font-bold text-slate-900">Scrapbook</span>
              <span class="text-xs text-slate-500 mt-1">Paper cutout berlapis, tepi robek, tekstur cat air & kolase multi-dimensi</span>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="submit-btn"
          class="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <span id="btn-text">Generate Prompt Masterpiece</span>
          <span id="btn-spinner" class="hidden animate-spin">⏳</span>
        </button>
      </form>

      <!-- Result Container -->
      <div id="result-container" class="hidden mt-8 pt-8 border-t border-slate-200 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900">Hasil Prompt Master:</h2>
          <span id="style-badge" class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full"></span>
        </div>

        <div class="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-sm leading-relaxed relative group">
          <p id="prompt-output" class="whitespace-pre-wrap"></p>
          <button id="copy-btn" class="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-amber-300 border border-slate-700">
            Salin Prompt
          </button>
        </div>
      </div>
    </div>
  </main>
</Layout>

<script>
  const form = document.getElementById('prompt-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const btnText = document.getElementById('btn-text')!;
  const btnSpinner = document.getElementById('btn-spinner')!;
  const resultContainer = document.getElementById('result-container')!;
  const promptOutput = document.getElementById('prompt-output')!;
  const styleBadge = document.getElementById('style-badge')!;
  const copyBtn = document.getElementById('copy-btn')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const topic = formData.get('topic') as string;
    const style = formData.get('style') as string;

    submitBtn.disabled = true;
    btnText.textContent = 'Memproses di Server Gemini...';
    btnSpinner.classList.remove('hidden');

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Gagal generate prompt');

      styleBadge.textContent = data.styleDisplayName || style;
      promptOutput.textContent = data.masterImagePrompt || data.midjourneySyntax;
      resultContainer.classList.remove('hidden');
      resultContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Generate Prompt Masterpiece';
      btnSpinner.classList.add('hidden');
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptOutput.textContent || '');
    copyBtn.textContent = 'Tersalin! ✅';
    setTimeout(() => { copyBtn.textContent = 'Salin Prompt'; }, 2000);
  });
</script>`,
  },
  {
    filename: 'Layout.astro',
    path: 'src/layouts/Layout.astro',
    language: 'html',
    description: 'Layout dasar Astro dengan Tailwind CSS',
    code: `---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="Generator Prompt Animasi Astro SSR Cloudflare Workers" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen">
    <slot />
  </body>
</html>

<style is:global>
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
</style>`,
  },
  {
    filename: 'package.json',
    path: 'package.json',
    language: 'json',
    description: 'Dependencies Astro + Cloudflare Adapter + Google GenAI SDK',
    code: `{
  "name": "astro-cloudflare-animation-prompter",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "astro build && wrangler deploy"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.0.0",
    "@astrojs/tailwind": "^5.1.0",
    "@google/genai": "^2.4.0",
    "astro": "^5.0.0",
    "tailwindcss": "^3.4.1"
  },
  "devDependencies": {
    "wrangler": "^3.100.0"
  }
}`,
  },
  {
    filename: '.env.example',
    path: '.env.example',
    language: 'bash',
    description: 'Contoh variabel lingkungan (Environment Variables)',
    code: `# Google Gemini API Key (didapatkan dari Google AI Studio: https://aistudio.google.com)
GEMINI_API_KEY="AIzaSy..."

# Formula Rahasia System Prompt (Tersimpan aman di Server / Cloudflare Workers Secrets)
SYSTEM_PROMPT_SECRET_FORMULA="You are the World's Premier Animation Art Director and Prompt Engineering Architect..."`,
  },
  {
    filename: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Panduan Instalasi dan Deployment ke Cloudflare Workers',
    code: `# 🚀 Astro.js SSR Animation Prompt Generator (Cloudflare Workers)

Proyek Astro.js dengan mode **Server-Side Rendering (SSR)** yang dideploy ke **Cloudflare Workers**. 
Menggunakan **Google AI Studio (Gemini API)** dengan pengamanan formula prompt rahasia di server-side.

---

## 🔒 Keamanan Formula System Prompt
Formula system prompt dan instruksi detail art direction diletakkan di dalam \`src/pages/api/generate-prompt.ts\` dan dibaca dari Environment Variables (\`GEMINI_API_KEY\` & \`SYSTEM_PROMPT_SECRET_FORMULA\`). Browser/klien **hanya menerima hasil JSON akhir** tanpa pernah mengetahui rumus atau formula prompt asli.

---

## 🛠️ Persiapan Lokal
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Salin environment variables
cp .env.example .env
# Isi GEMINI_API_KEY dengan API Key Anda dari Google AI Studio

# 3. Jalankan development server
npm run dev
\`\`\`

---

## ☁️ Deployment ke Cloudflare Workers

1. **Login ke Cloudflare via Wrangler CLI**:
   \`\`\`bash
   npx wrangler login
   \`\`\`

2. **Simpan Secret Variables di Cloudflare**:
   \`\`\`bash
   npx wrangler secret put GEMINI_API_KEY
   # Masukkan Gemini API Key saat diminta

   npx wrangler secret put SYSTEM_PROMPT_SECRET_FORMULA
   # (Opsional) Masukkan formula khusus bila ingin meng-override default
   \`\`\`

3. **Deploy Project**:
   \`\`\`bash
   npm run deploy
   \`\`\`

Aplikasi Astro SSR Anda akan langsung aktif di domain \`https://astro-animation-prompter.<your-subdomain>.workers.dev\`.`,
  },
];
