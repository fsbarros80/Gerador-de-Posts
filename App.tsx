import React, { useState, useCallback } from 'react';
import IdeaForm from './components/IdeaForm';
import SocialPostCard from './components/SocialPostCard';
import { Tone, SocialPost, HistoryItem } from './types';
import { generateAllContent } from './services/geminiService';
import { useHistory } from './hooks/useHistory';
import HistoryList from './components/HistoryList';
import { useSavedPosts } from './hooks/useSavedPosts';
import SavedPostsList from './components/SavedPostsList';

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { history, addToHistory, clearHistory } = useHistory();
  const { savedPosts, removeSavedPost } = useSavedPosts();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedPosts([]);

    try {
      const posts = await generateAllContent(idea, tone);
      setGeneratedPosts(posts);
      addToHistory({ idea, tone, posts });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [idea, tone, addToHistory]);

  const handleSelectItem = (item: HistoryItem) => {
    setIdea(item.idea);
    setTone(item.tone);
    setGeneratedPosts(item.posts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const InitialState = () => (
    <div className="text-center py-16 px-4">
      <div className="mx-auto mb-4 h-16 w-16 text-indigo-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Pronto para Gerar Engajamento?</h2>
      <p className="mt-3 text-lg leading-8 text-gray-400">
        Insira sua ideia e selecione um tom acima para gerar conteúdo com IA para seus canais sociais.
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-8 animate-pulse-fast">
        {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden ring-1 ring-white/10">
                <div className="p-5">
                    <div className="h-7 w-40 bg-gray-700 rounded-md"></div>
                </div>
                 <div className="bg-gray-900 aspect-[16/9] flex justify-center items-center">
                    <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                 </div>
                <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
              Gerador de Conteúdo de Mídia Social com IA
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Crie instantaneamente posts e imagens personalizados para LinkedIn, Twitter/X, Instagram e Facebook a partir de uma única ideia.
            </p>
          </div>

          <div className="bg-gray-800/40 p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 mb-12">
            <IdeaForm
              idea={idea}
              setIdea={setIdea}
              tone={tone}
              setTone={setTone}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg text-center mb-8 ring-1 ring-red-500/50">
              <p><strong>Oops! Algo deu errado.</strong></p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {isLoading && <LoadingState />}
            {!isLoading && generatedPosts.length > 0 && generatedPosts.map((post) => (
              <SocialPostCard key={post.platform} post={post} />
            ))}
             {!isLoading && generatedPosts.length === 0 && !error && <InitialState />}
          </div>
          
          <SavedPostsList
            savedPosts={savedPosts}
            onRemoveItem={removeSavedPost}
          />
          
          <HistoryList
            history={history}
            onSelectItem={handleSelectItem}
            onClearHistory={clearHistory}
           />
        </div>
      </main>
    </div>
  );
};

export default App;