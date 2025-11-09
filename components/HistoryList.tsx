import React, { useState, useMemo } from 'react';
import { HistoryItem, Tone } from '../types';
import { TrashIcon, ChevronDownIcon } from './icons/ActionIcons';

interface HistoryListProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectItem, onClearHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterTone, setFilterTone] = useState<Tone | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const processedHistory = useMemo(() => {
    let result = [...history];

    if (filterTone !== 'all') {
      result = result.filter(item => item.tone === filterTone);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [history, filterTone, sortOrder]);

  const handleClearHistory = () => {
    const isConfirmed = window.confirm(
      'Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita.'
    );
    if (isConfirmed) {
      onClearHistory();
    }
  };

  if (history.length === 0) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectClasses = "block w-full rounded-md border-0 bg-white/5 py-1.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6";

  return (
    <div className="mt-16">
      <div className="bg-gray-800/40 rounded-lg ring-1 ring-white/10">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-lg"
            aria-expanded={isOpen}
            aria-controls="history-content"
        >
            <h2 className="text-2xl font-bold text-white">Histórico de Ideias</h2>
            <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div
            id="history-content"
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        >
            <div className="p-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                        <div className='flex-1'>
                            <label htmlFor="filter-tone" className="block text-sm font-medium leading-6 text-gray-300">
                                Filtrar por tom
                            </label>
                            <select 
                                id="filter-tone" 
                                name="filter-tone"
                                className={selectClasses}
                                value={filterTone}
                                onChange={(e) => setFilterTone(e.target.value as Tone | 'all')}
                            >
                                <option value="all">Todos os Tons</option>
                                {Object.values(Tone).map(tone => (
                                <option key={tone} value={tone}>{tone}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="sort-order" className="block text-sm font-medium leading-6 text-gray-300">
                                Ordenar por
                            </label>
                            <select 
                                id="sort-order" 
                                name="sort-order"
                                className={selectClasses}
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            >
                                <option value="newest">Mais Recente</option>
                                <option value="oldest">Mais Antigo</option>
                            </select>
                        </div>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="flex self-end items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md bg-red-900/50 text-red-200 hover:bg-red-800/70 transition-colors"
                            aria-label="Limpar histórico"
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span>Limpar</span>
                        </button>
                    )}
                </div>

                <ul className="divide-y divide-white/10 border-t border-white/5 pt-4">
                    {processedHistory.length > 0 ? processedHistory.map((item) => (
                        <li key={item.id}>
                        <button
                            onClick={() => onSelectItem(item)}
                            className="w-full text-left p-4 hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:bg-gray-700/50 rounded-lg"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-indigo-400 truncate">{item.idea}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Tom: <span className="font-medium text-gray-300">{item.tone}</span>
                                    </p>
                                </div>
                                <time className="text-xs text-gray-500 flex-shrink-0 mt-0.5">{formatDate(item.createdAt)}</time>
                            </div>
                        </button>
                        </li>
                    )) : (
                        <li className="p-4 text-center text-sm text-gray-400">
                            Nenhum item encontrado com os filtros selecionados.
                        </li>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
