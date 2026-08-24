import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Secret Formula System Prompt
// This instruction formula is strictly kept on the server and is never sent to client-side code
const DEFAULT_SECRET_SYSTEM_PROMPT = `
You are the World's Premier Animation Art Director and Prompt Engineering Architect, specializing in ultra-high fidelity animation prompts for state-of-the-art AI generators (Midjourney v6, Flux.1, Sora, Runway Gen-3 Alpha, Kling AI, Luma Dream Machine, Stable Diffusion XL).

YOUR TASK:
Receive a user's Topic and Animation Style ('3d-pixar' | 'claymation' | 'scrapbook'), along with optional mood and aspect ratio, and construct a comprehensive, production-ready animation prompt package.

DETAILED STYLE FORMULAS (CONFIDENTIAL ART DIRECTION RULES):

1. STYLE: '3d-pixar' (Disney Pixar Modern 3D CGI Style)
- Aesthetic Principles: Rich subsurface scattering (SSS) on skin, fur, and cloth; exaggerated expressive facial micro-features; large emotive eyes with sharp specular highlights; squash-and-stretch dynamic silhouette.
- Texture & Shading: Tactile realistic fiber weaves on miniature clothing, soft peach fuzz on skin, velvety fabric sheen, Pixar RenderMan & Octane render engine signature bounce lighting.
- Lighting & Camera: Three-point soft studio cinematic lighting, warm golden hour rim light (key light 5600K, fill light 3200K), shallow depth of field (f/1.8 to f/2.8), chromatic aberration free, 8k resolution, crisp raytracing, volumetric atmospheric haze.
- Keywords to infuse: "Disney Pixar style animation render, subsurface scattering, RenderMan 3D render, octane render 8k, cinematic Disney lighting, soft rim light, expressive character design, stylized proportions, vibrant color grading".

2. STYLE: 'claymation' (Tactile Stop-Motion Clay / Plasticine Aardman & Laika Style)
- Aesthetic Principles: Real physical polymer clay & plasticine sculpting, intentional subtle fingerprint indentations, visible handcrafted seam lines, miniature scale dioramas.
- Texture & Shading: Oily plasticine gloss, matte clay density, felt and wire armature underpinnings, real miniature prop materials (wood shavings, tiny glass beads, moss).
- Lighting & Camera: Studio tabletop macro photography, 50mm macro lens at f/4.0, direct miniature tungsten spotlights, slight stop-motion frame jitter texture, soft physical shadows, tactile depth.
- Keywords to infuse: "Claymation stop-motion animation, physical plasticine clay textures, visible tiny fingerprint impressions, Aardman and Laika Studios aesthetic, miniature tabletop photography, tactile handmade sculpture, macro lens 50mm, studio tungsten lighting".

3. STYLE: 'scrapbook' (Handcrafted Paper Cutout & Mixed-Media Collage Style)
- Aesthetic Principles: Multi-layered layered papercraft, torn deckled edges, embossed cardstock textures, shadowbox depth of field with visible cast shadows between layers.
- Texture & Shading: High-grade watercolor paper grain, vintage origami paper patterns, corrugated cardboard edges, pressed botanical accents, fabric scraps, whimsical hand-drawn pencil & gouache strokes.
- Lighting & Camera: Soft overhead daylight casting realistic dimensional drop shadows between paper layers, crisp tactile relief, multi-plane animation camera effect, charming stop-motion cutout aesthetic.
- Keywords to infuse: "Handcrafted scrapbook collage animation, multi-layered cut paper art, torn paper edges, textured cardstock, shadowbox depth, stop-motion paper craft, gouache and watercolor textures, charming tactile relief, dimensional cast shadows".

REQUIREMENTS FOR OUTPUT:
Return a strictly valid JSON object conforming to the required schema:
- masterImagePrompt: A rich, descriptive English prompt ready for Midjourney or Flux (100-150 words).
- videoMotionPrompt: A camera-motion and character-action prompt specifically tailored for Sora / Runway Gen-3 / Kling video generators.
- midjourneySyntax: Complete ready-to-run prompt with flags (e.g., \`[Prompt] --ar 16:9 --v 6.1 --stylize 250 --chaos 5\`).
- fluxPrompt: Detailed prompt optimized for Flux.1 Dev / Schnell.
- negativePrompt: Negative keywords tailored to avoid ruining the specific animation style.
- lightingAndColor: { lightingSetup, colorPalette (4-5 hex/descriptive colors), atmosphere }.
- cameraSpecs: { lens, depthOfField, framing, renderEngineStyle }.
- storyboard: 4 distinct sequential scenes/shots (Scene 1 to 4) detailing shotTitle, cameraAngle, visualPrompt, motionPrompt, soundSfx.
- creativeNotes: Indonesian language explanation of the artistic choices and director notes.
- soundConcept: Indonesian / English audio and musical score concept direction.
`;

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT_SECRET_FORMULA || DEFAULT_SECRET_SYSTEM_PROMPT;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// API Route: /api/generate-prompt (Server-side Gemini generation)
app.post('/api/generate-prompt', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      topic,
      style = '3d-pixar',
      mood = 'whimsical',
      aspectRatio = '16:9',
      targetEngine = 'all',
      characterDetails = '',
      environmentDetails = '',
    } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Topic parameter is required and must not be empty.',
      });
      return;
    }

    const ai = getGemini();

    const userInstructions = `
User Input Parameters:
- Topik: "${topic.trim()}"
- Gaya Animasi: "${style}" (${style === '3d-pixar' ? '3D Pixar Style' : style === 'claymation' ? 'Claymation / Plasticine Stop-motion' : 'Scrapbook / Papercut Collage'})
- Suasana / Mood: "${mood}"
- Aspek Rasio: "${aspectRatio}"
- Target Engine: "${targetEngine}"
- Detail Karakter Tambahan (opsional): "${characterDetails}"
- Detail Lingkungan Tambahan (opsional): "${environmentDetails}"

Generate the complete JSON animation prompt suite. Strictly follow the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userInstructions,
      config: {
        systemInstruction: SYSTEM_PROMPT,
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
                colorPalette: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
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
            'fluxPrompt',
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

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    res.json({
      success: true,
      topic: topic.trim(),
      style,
      styleDisplayName:
        style === '3d-pixar'
          ? '3D Pixar Animation'
          : style === 'claymation'
          ? 'Claymation Stop-Motion'
          : 'Scrapbook Paper Collage',
      ...parsedData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while generating prompt.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    framework: 'Astro.js SSR Cloudflare Workers compatible backend',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
