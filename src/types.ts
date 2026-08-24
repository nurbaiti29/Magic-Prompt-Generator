export type AnimationStyle = '3d-pixar' | 'claymation' | 'scrapbook';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '21:9' | '4:3';

export type MoodAtmosphere = 'whimsical' | 'cinematic' | 'mysterious' | 'warm-nostalgic' | 'action-adventure';

export type TargetAiEngine = 'all' | 'midjourney' | 'sora-runway' | 'flux-sd';

export interface PromptGenerationRequest {
  topic: string;
  style: AnimationStyle;
  mood?: MoodAtmosphere;
  aspectRatio?: AspectRatio;
  targetEngine?: TargetAiEngine;
  characterDetails?: string;
  environmentDetails?: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  shotTitle: string;
  cameraAngle: string;
  visualPrompt: string;
  motionPrompt: string;
  soundSfx: string;
}

export interface PromptGenerationResponse {
  success: boolean;
  topic: string;
  style: AnimationStyle;
  styleDisplayName: string;
  masterImagePrompt: string;
  videoMotionPrompt: string;
  midjourneySyntax: string;
  fluxPrompt: string;
  negativePrompt: string;
  lightingAndColor: {
    lightingSetup: string;
    colorPalette: string[];
    atmosphere: string;
  };
  cameraSpecs: {
    lens: string;
    depthOfField: string;
    framing: string;
    renderEngineStyle: string;
  };
  storyboard: StoryboardScene[];
  creativeNotes: string;
  soundConcept: string;
  generatedAt: string;
}

export interface AstroFileItem {
  filename: string;
  path: string;
  language: string;
  description: string;
  code: string;
}
