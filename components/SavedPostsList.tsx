import React, { useState } from 'react';
import { SavedPost } from '../types';
import { TrashIcon, CopyIcon, CheckIcon, LightbulbIcon, ExportIcon } from './icons/ActionIcons';
import { PlatformIcon } from './icons/PlatformIcons';
import { useNotification } from './Notification';
import { exportSavedPosts } from '../utils/export';

interface SavedPostsListProps {
  savedPosts: SavedPost[];
  onRemoveItem: (id: number) => void;
}

const SavedPostsList: React.FC<SavedPostsListProps> = ({ savedPosts, onRemoveItem }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const { showNotification } = useNotification();

  if (savedPosts.length === 0) {
    return null;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };
  
  const handleRemove = (id: number) => {
    onRemoveItem(id);
    showNotification('Post removido permanentemente.', 'info');
  };

  const handleExport = () => {
    exportSavedPosts(savedPosts, exportFormat);
    showNotification(`Posts exportados como ${exportFormat.toUpperCase()} com sucesso!`, 'success');
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">Posts Salvos</h2>
        <div className="flex items-center gap-2">
            <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-3 pr-8 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 text-xs"
            >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
            </select>
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                <ExportIcon className="h-4 w-4" />
                <span>Exportar</span>
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedPosts.map((post) => {
          const contentCopyKey = `content-${post.id}`;
          const promptCopyKey = `prompt-${post.id}`;
          const isContentCopied = copiedStates[contentCopyKey];
          const isPromptCopied = copiedStates[promptCopyKey];

          return (
            <div key={post.id} className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden ring-1 ring-white/10 flex flex-col group transition-all duration-300 hover:ring-indigo-500 hover:shadow-indigo-500/10">
              <div className="aspect-square w-full overflow-hidden relative">
                <img 
                  src={post.mediaUrl} 
                  alt={`Imagem para ${post.platform}`} 
                  className="w-full h-full object-cover bg-gray-700 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                 <div className="absolute top-2 right-2">
                    <button
                        onClick={() => handleRemove(post.id)}
                        className="p-2 rounded-full bg-black/50 text-gray-300 hover:bg-red-600 hover:text-white transition-colors backdrop-blur-sm"
                        aria-label="Remover post salvo"
                        title="Remover post salvo"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                 </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <PlatformIcon platform={post.platform} className="h-5 w-5 text-gray-400" />
                        <span className="font-bold text-md text-white">{post.platform}</span>
                    </div>
                     <span className="text-xs text-gray-500">
                        {new Date(post.savedAt).toLocaleDateString('pt-BR')}
                    </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3 flex-grow mb-4">{post.content}</p>
                <div className="mt-auto pt-3 border-t border-white/10 flex justify-end items-center gap-1">
                    <button
                        onClick={() => handleCopy(post.content, contentCopyKey)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Copiar texto"
                    >
                        {isContentCopied ? <CheckIcon className="h-3 w-3 text-green-400" /> : <CopyIcon className="h-3 w-3" />}
                        <span>Texto</span>
                    </button>
                    <button
                        onClick={() => handleCopy(post.imagePrompt, promptCopyKey)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Copiar prompt"
                    >
                        {isPromptCopied ? <CheckIcon className="h-3 w-3 text-green-400" /> : <CopyIcon className="h-3 w-3" />}
                        <span>Prompt</span>
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPostsList;