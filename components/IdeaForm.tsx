import React from 'react';
import { Tone } from '../types';

interface IdeaFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const toneOptions = Object.values(Tone);

const IdeaForm: React.FC<IdeaFormProps> = ({
  idea,
  setIdea,
  tone,
  setTone,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="idea" className="block text-sm font-medium text-gray-300 mb-2">
          Qual é a sua ideia de conteúdo?
        </label>
        <textarea
          id="idea"
          name="idea"
          rows={3}
          className="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 disabled:opacity-50"
          placeholder="ex: Lançamento de um novo produto para um aplicativo de produtividade"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <h3 className="block text-sm font-medium text-gray-300 mb-2">Escolha um tom</h3>
        <div className="flex flex-wrap gap-3">
          {toneOptions.map((toneOption) => (
            <button
              key={toneOption}
              type="button"
              onClick={() => setTone(toneOption)}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 disabled:opacity-50 ${
                tone === toneOption
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {toneOption}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando...
            </>
          ) : (
            'Gerar Conteúdo ✨'
          )}
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;