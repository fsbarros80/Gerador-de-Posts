

export enum Tone {
  Professional = 'Profissional',
  Witty = 'Espirituoso',
  Urgent = 'Urgente',
  Inspirational = 'Inspirador',
  Informative = 'Informativo',
  Friendly = 'Amigável',
  Playful = 'Divertido',
  Empathetic = 'Empático',
  Optimistic = 'Otimista',
  Critical = 'Crítico',
  Humorous = 'Humorístico',
}

export enum Platform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter/X',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
}

export interface ImagePromptSuggestions {
  photography: string;
  illustration: string;
  conceptArt: string;
  watercolor: string;
  cartoon: string;
  abstract: string;
  threeDRender: string;
  pixelArt: string;
  neoBrutalism: string;
  cgiArt: string;
  anime: string;
}

export interface SocialPost {
  platform: Platform;
  content: string;
  imageUrl: string;
  imagePrompt: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '9:16';
  imagePromptSuggestions: ImagePromptSuggestions;
}

export interface GeneratedText {
    linkedin: string;
    twitter: string;
    instagram:string;
    facebook: string;
    linkedinImagePrompts: ImagePromptSuggestions;
    twitterImagePrompts: ImagePromptSuggestions;
    instagramImagePrompts: ImagePromptSuggestions;
    facebookImagePrompts: ImagePromptSuggestions;
}

export interface HistoryItem {
  id: number;
  idea: string;
  tone: Tone;
  posts: SocialPost[];
  createdAt: string;
}

export interface SavedPost {
  id: number;
  platform: Platform;
  content: string;
  mediaUrl: string;
  mediaType: 'image';
  imagePrompt: string;
  savedAt: string;
}