import { GoogleGenAI, Type } from "@google/genai";
import { Tone, Platform, SocialPost, GeneratedText, ImagePromptSuggestions } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateTextContent = async (idea: string, tone: Tone): Promise<GeneratedText> => {
  const model = 'gemini-2.5-pro';
  const systemInstruction = "Você é um especialista em gerenciamento de mídias sociais. Sua tarefa é gerar conteúdo atraente e sugestões de prompt de imagem para diferentes plataformas com base na ideia do usuário e no tom desejado. Forneça a saída no formato JSON especificado.";
  
  const prompt = `
    Gere posts de mídia social e sugestões de prompt de imagem para a seguinte ideia: "${idea}"
    O tom desejado é: "${tone}"

    **Parte 1: Conteúdo do Post**
    Crie conteúdo de texto personalizado para cada uma destas plataformas:
    1.  **LinkedIn:** Um post profissional e longo (2-4 parágrafos) adequado para uma rede profissional. Deve ser perspicaz, incentivar a discussão e terminar com uma pergunta clara ou um call-to-action para engajar os leitores (por exemplo, "Qual é a sua experiência com isso? Compartilhe nos comentários!").
    2.  **Twitter/X:** Um tweet curto, impactante e envolvente (menos de 280 caracteres). Use 1-2 hashtags relevantes.
    3.  **Instagram:** Uma legenda focada no visual. Comece com um gancho forte, seguido por um parágrafo descritivo curto. Termine com um call-to-action claro e envolvente, como fazer uma pergunta ou pedir para marcar um amigo. Inclua de 3 a 5 hashtags relevantes e populares.
    4.  **Facebook:** Um post amigável e conversacional (1-2 parágrafos). Pode incluir uma pergunta para estimular o engajamento. Use 1-2 hashtags relevantes.

    **Parte 2: Sugestões de Prompt de Imagem**
    Para CADA plataforma (LinkedIn, Twitter/X, Instagram, Facebook), forneça onze sugestões de prompt criativas e detalhadas. Os prompts devem ser otimizados para um gerador de mídia de IA (como Imagen) e devem refletir a ideia, o tom e o público da plataforma.
    Para cada plataforma, crie um prompt para cada um dos seguintes estilos:
    1.  **Fotografia:** Descritivo, realista, com detalhes sobre iluminação, composição e emoção.
    2.  **Ilustração:** Estilo artístico claro (ex: vetor, aquarela, 3D), com detalhes sobre o tema e a paleta de cores.
    3.  **Arte Conceitual:** Foco em design de personagem/ambiente, atmosfera e narrativa visual.
    4.  **Aquarela:** Efeito de pintura tradicional, com pinceladas fluidas e mistura de cores.
    5.  **Estilo de Desenho Animado:** Simplificado, com contornos ousados e cores vibrantes, estilo cartoon clássico.
    6.  **Abstrato:** Conceitual, focado em formas, cores e texturas que evocam o sentimento da ideia.
    7.  **Renderização 3D:** Fotorrealista ou estilizado, com foco em profundidade, materiais e iluminação de cena.
    8.  **Arte Pixelizada:** Estilo retrô, 8-bit ou 16-bit, especificando a paleta de cores e a complexidade do sprite.
    9.  **Neo-brutalismo:** Formas geométricas ousadas, cores fortes e contrastantes, tipografia proeminente e uma estética digital crua.
    10. **Arte CGI:** Imagens geradas por computador com acabamento polido, texturas hiper-realistas e iluminação complexa.
    11. **Anime:** Estética de animação japonesa, com personagens de olhos grandes, cabelos coloridos, linhas de ação dinâmicas e cores vibrantes.
  `;

  const imagePromptSuggestionsSchema = {
      type: Type.OBJECT,
      description: "Sugestões de prompt de imagem para diferentes estilos.",
      properties: {
          photography: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo fotográfico." },
          illustration: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo ilustração." },
          conceptArt: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo arte conceitual." },
          watercolor: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo aquarela." },
          cartoon: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo desenho animado." },
          abstract: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo abstrato." },
          threeDRender: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo renderização 3D." },
          pixelArt: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo arte pixelizada." },
          neoBrutalism: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo neo-brutalismo." },
          cgiArt: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo arte CGI." },
          anime: { type: Type.STRING, description: "Um prompt detalhado para uma imagem de estilo anime." },
      },
      required: ["photography", "illustration", "conceptArt", "watercolor", "cartoon", "abstract", "threeDRender", "pixelArt", "neoBrutalism", "cgiArt", "anime"]
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          linkedin: { type: Type.STRING, description: "Conteúdo para o post do LinkedIn" },
          twitter: { type: Type.STRING, description: "Conteúdo para o post do Twitter/X" },
          instagram: { type: Type.STRING, description: "Conteúdo para o post do Instagram" },
          facebook: { type: Type.STRING, description: "Conteúdo para o post do Facebook" },
          linkedinImagePrompts: imagePromptSuggestionsSchema,
          twitterImagePrompts: imagePromptSuggestionsSchema,
          instagramImagePrompts: imagePromptSuggestionsSchema,
          facebookImagePrompts: imagePromptSuggestionsSchema,
        },
        required: ["linkedin", "twitter", "instagram", "facebook", "linkedinImagePrompts", "twitterImagePrompts", "instagramImagePrompts", "facebookImagePrompts"],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeneratedText;
  } catch (e) {
    console.error("Falha ao analisar a resposta de texto do Gemini:", response.text);
    throw new Error("Não foi possível analisar o conteúdo gerado. Por favor, tente novamente.");
  }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' | '9:16'): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateAllContent = async (idea: string, tone: Tone): Promise<SocialPost[]> => {
    const content = await generateTextContent(idea, tone);

    const initialImagePrompts = {
        [Platform.LinkedIn]: content.linkedinImagePrompts.photography,
        [Platform.Twitter]: content.twitterImagePrompts.photography,
        [Platform.Instagram]: content.instagramImagePrompts.photography,
        [Platform.Facebook]: content.facebookImagePrompts.photography,
    };
    
    const platforms: { 
        platform: Platform; 
        content: string; 
        aspectRatio: '1:1' | '16:9' | '4:3' | '9:16';
        imagePromptSuggestions: ImagePromptSuggestions;
    }[] = [
        { platform: Platform.LinkedIn, content: content.linkedin, aspectRatio: '4:3', imagePromptSuggestions: content.linkedinImagePrompts },
        { platform: Platform.Twitter, content: content.twitter, aspectRatio: '16:9', imagePromptSuggestions: content.twitterImagePrompts },
        { platform: Platform.Instagram, content: content.instagram, aspectRatio: '1:1', imagePromptSuggestions: content.instagramImagePrompts },
        { platform: Platform.Facebook, content: content.facebook, aspectRatio: '1:1', imagePromptSuggestions: content.facebookImagePrompts },
    ];
    
    const imagePromises = platforms.map(p => generateImage(initialImagePrompts[p.platform], p.aspectRatio));

    const imageUrls = await Promise.all(imagePromises);

    return platforms.map((p, index) => ({
        ...p,
        imageUrl: imageUrls[index],
        imagePrompt: initialImagePrompts[p.platform],
    }));
};