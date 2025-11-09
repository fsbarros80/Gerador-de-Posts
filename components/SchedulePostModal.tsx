import React, { useState, useEffect } from 'react';
import { SocialPost } from '../types';
import { PlatformIcon } from './icons/PlatformIcons';
import { WarningIcon, CheckIcon } from './icons/ActionIcons';

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SocialPost;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen, onClose, post }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('buffer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Redefine o estado quando o modal é aberto
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Padrão para 30 minutos a partir de agora
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().substring(0, 5));
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simula uma chamada de API para o serviço de agendamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (Math.random() > 0.15) { // 85% de taxa de sucesso
      const formattedDate = new Date(`${date}T${time}`).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
      setSuccessMessage(`Post agendado com sucesso para ${formattedDate} às ${time} via ${serviceName}.`);
    } else {
      setError('Falha ao conectar com o serviço de agendamento. Por favor, tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity animate-[fade-in_200ms_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-lg transform transition-all animate-[slide-up_300ms_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <PlatformIcon platform={post.platform} className="h-6 w-6 text-gray-400" />
                Agendar Post para {post.platform}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Fechar modal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="p-6">
          {successMessage ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <CheckIcon className="h-7 w-7" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">Agendado!</h4>
              <p className="mt-2 text-sm text-gray-300">{successMessage}</p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg">
                    <img src={post.imageUrl} alt="Preview da imagem" className="w-20 h-20 object-cover rounded-md bg-gray-700 flex-shrink-0" loading="lazy" />
                    <p className="text-sm text-gray-400 line-clamp-4 flex-1">{post.content}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                        <input
                            type="date"
                            id="schedule-date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            disabled={isLoading}
                            className="block w-full rounded-md border-0 bg-white/5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-300 mb-1">Hora</label>
                        <input
                            type="time"
                            id="schedule-time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                            disabled={isLoading}
                            className="block w-full rounded-md border-0 bg-white/5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="schedule-service" className="block text-sm font-medium text-gray-300 mb-1">Agendar com</label>
                    <select
                    id="schedule-service"
                    value={service}
                    onChange={e => setService(e.target.value)}
                    required
                    disabled={isLoading}
                    className="block w-full rounded-md border-0 bg-white/5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="buffer">Buffer</option>
                        <option value="hootsuite">Hootsuite</option>
                        <option value="later">Later</option>
                        <option value="sproutsocial">Sprout Social</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Isso é uma simulação. Nenhuma conexão real será feita.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/30 text-red-300 text-sm rounded-lg flex items-start gap-3 ring-1 ring-red-500/30">
                    <WarningIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !date || !time}
                        className="flex w-44 justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Agendando...
                            </>
                        ) : (
                            'Confirmar Agendamento'
                        )}
                    </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePostModal;