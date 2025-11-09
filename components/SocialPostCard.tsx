import React from 'react';
import { SocialPost, Platform } from '../types';
import { PlatformIcon, TwitterIcon, LinkedInIcon, FacebookIcon, InstagramIcon } from './icons/PlatformIcons';
import { DownloadIcon, LightbulbIcon, CopyIcon, CheckIcon, StarIcon, WarningIcon, CalendarIcon, ZoomInIcon } from './icons/ActionIcons';
import { generateImage } from '../services/geminiService';
import { useSavedPosts } from '../hooks/useSavedPosts';
import SchedulePostModal from './SchedulePostModal';
import { useNotification } from './Notification';
import ImageFocusModal from './ImageFocusModal';

interface SocialPostCardProps {
  post: SocialPost;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  const [copied, setCopied] = React.useState(false);
  const [promptCopied, setPromptCopied] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState(post.imageUrl);
  const [currentImagePrompt, setCurrentImagePrompt] = React.useState(post.imagePrompt);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [error, setError] = React.useState<{ message: string; prompt: string } | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = React.useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = React.useState(false);
  
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { showNotification } = useNotification();

  const currentMediaUrl = currentImageUrl;
  const isSaved = isPostSaved({ mediaUrl: currentMediaUrl ?? '' });

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentImagePrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentMediaUrl) return;
    const link = document.createElement('a');
    link.href = currentMediaUrl;
    link.download = `${post.platform.toLowerCase().replace('/','-')}-post-image.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRegenerateMedia = async (newPrompt: string) => {
    if (newPrompt === currentImagePrompt && !error) { // Permite nova tentativa em caso de erro
        return;
    }

    setIsRegenerating(true);
    setError(null);
    try {
        const newImageUrl = await generateImage(newPrompt, post.aspectRatio);
        setCurrentImageUrl(newImageUrl);
        setCurrentImagePrompt(newPrompt);
    } catch (err) {
        console.error("Falha ao regenerar a imagem:", err);
        setError({
            message: `Não foi possível gerar a nova imagem. Verifique sua conexão ou tente novamente.`,
            prompt: newPrompt
        });
    } finally {
        setIsRegenerating(false);
    }
  };

  const handleToggleSave = () => {
    if (!currentMediaUrl) return;

    toggleSavePost({
      platform: post.platform,
      content: post.content,
      mediaUrl: currentMediaUrl,
      mediaType: 'image',
      imagePrompt: currentImagePrompt,
    });
    
    if (!isSaved) {
        showNotification('Post salvo com sucesso!', 'success');
    } else {
        showNotification('Post removido dos salvos.', 'info');
    }
  };

  const StyleSelector = () => {
    const suggestions = [
        { key: 'photography', title: 'Fotografia', prompt: post.imagePromptSuggestions.photography },
        { key: 'illustration', title: 'Ilustração', prompt: post.imagePromptSuggestions.illustration },
        { key: 'conceptArt', title: 'Arte Conceitual', prompt: post.imagePromptSuggestions.conceptArt },
        { key: 'watercolor', title: 'Aquarela', prompt: post.imagePromptSuggestions.watercolor },
        { key: 'cartoon', title: 'Desenho Animado', prompt: post.imagePromptSuggestions.cartoon },
        { key: 'abstract', title: 'Abstrata', prompt: post.imagePromptSuggestions.abstract },
        { key: 'threeDRender', title: '3D', prompt: post.imagePromptSuggestions.threeDRender },
        { key: 'pixelArt', title: 'Pixel Art', prompt: post.imagePromptSuggestions.pixelArt },
        { key: 'neoBrutalism', title: 'Neo-brutalismo', prompt: post.imagePromptSuggestions.neoBrutalism },
        { key: 'cgiArt', title: 'Arte CGI', prompt: post.imagePromptSuggestions.cgiArt },
        { key: 'anime', title: 'Anime', prompt: post.imagePromptSuggestions.anime },
    ];

    return (
        <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <LightbulbIcon className="h-4 w-4 text-yellow-300" />
                Mudar Estilo da Imagem
            </h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.key}
                        onClick={() => handleRegenerateMedia(suggestion.prompt)}
                        disabled={isRegenerating}
                        title={suggestion.prompt}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            currentImagePrompt === suggestion.prompt
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {suggestion.title}
                    </button>
                ))}
            </div>
        </div>
    );
  };

  const MediaControls = () => (
    <div className="mt-4 pt-4 border-t border-white/10">
        <StyleSelector />
        {error && (
            <div className="mt-3 p-3 bg-red-900/30 text-red-300 text-sm rounded-lg ring-1 ring-red-500/30">
                <div className="flex items-start gap-3">
                    <WarningIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error.message}</span>
                </div>
                <div className="mt-2 text-right">
                    <button
                        onClick={() => handleRegenerateMedia(error.prompt)}
                        disabled={isRegenerating}
                        className="px-3 py-1 text-xs font-semibold rounded-md bg-red-500/30 text-red-200 hover:bg-red-500/50 transition-colors disabled:opacity-50"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        )}
        <div className="mt-4">
            <label className="block text-xs font-medium text-gray-400 mb-1">Prompt da Mídia Atual:</label>
            <div className="relative bg-black/20 p-3 rounded-md ring-1 ring-white/10">
                <p className="text-xs text-gray-300 font-mono pr-8">{currentImagePrompt}</p>
                 <button
                    onClick={handleCopyPrompt}
                    className="absolute top-2 right-2 p-1.5 bg-gray-700/50 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 transition-all"
                    aria-label="Copiar prompt da imagem"
                    >
                    {promptCopied ? (
                        <CheckIcon className="h-4 w-4 text-green-400" />
                    ) : (
                        <CopyIcon className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    </div>
  );

  const encodedContent = encodeURIComponent(post.content);

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden ring-1 ring-white/10 flex flex-col">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={post.platform} className="h-6 w-6 text-gray-400" />
            <h3 className="text-xl font-bold text-white">{post.platform}</h3>
          </div>
        </div>
        
        <div className="bg-gray-900 flex justify-center items-center relative group">
          <img src={currentImageUrl} alt={`Gerado para ${post.platform}`} className="w-full object-cover transition-opacity duration-300" style={{ opacity: isRegenerating ? 0.5 : 1 }} loading="lazy"/>
          
          {!isRegenerating && (
            <button
              onClick={() => setIsFocusModalOpen(true)}
              className="absolute inset-0 bg-black/60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-zoom-in"
              aria-label="Ver imagem em tela cheia"
            >
              <ZoomInIcon className="h-12 w-12 text-white/90"/>
            </button>
          )}

          {isRegenerating && (
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center backdrop-blur-sm">
                  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-3 text-sm text-white/80">Gerando nova imagem...</p>
              </div>
          )}
        </div>
        
        <div className="p-5 flex-grow">
          <div className="relative">
              <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{post.content}</p>
              <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 p-1.5 bg-gray-700/50 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 transition-all"
                  aria-label="Copiar conteúdo"
                  >
                  {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-400" />
                  ) : (
                      <CopyIcon className="h-4 w-4" />
                  )}
              </button>
          </div>
          <MediaControls />
        </div>

        <div className="px-5 pb-5">
          <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-400">Compartilhar:</span>
                  <a href={`https://twitter.com/intent/tweet?text=${encodedContent}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no Twitter/X" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                      <TwitterIcon className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" title="Abrir LinkedIn (copie o texto para colar)" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                      <LinkedInIcon className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Abrir Instagram (copie o texto e baixe a imagem)" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                      <InstagramIcon className="h-5 w-5" />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?quote=${encodedContent}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no Facebook" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                      <FacebookIcon className="h-5 w-5" />
                  </a>
              </div>
              <div className="flex items-center gap-2">
                  <button 
                      onClick={() => setIsSchedulingModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                      <CalendarIcon className="h-4 w-4" />
                      <span>Agendar</span>
                  </button>
                  <button 
                      onClick={handleToggleSave} 
                      className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                          isSaved 
                          ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' 
                          : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                      <StarIcon className="h-4 w-4" filled={isSaved} />
                      <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      <DownloadIcon className="h-4 w-4" />
                      <span>Baixar</span>
                  </button>
              </div>
          </div>
        </div>
      </div>
      
      <SchedulePostModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
        post={{
            ...post,
            imageUrl: currentImageUrl,
            imagePrompt: currentImagePrompt,
        }}
      />

      <ImageFocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        imageUrl={currentImageUrl}
        altText={`Imagem gerada para ${post.platform} com o prompt: ${currentImagePrompt}`}
      />
    </>
  );
};

export default SocialPostCard;
