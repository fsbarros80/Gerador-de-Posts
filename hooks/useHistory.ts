import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, SocialPost, Tone } from '../types';

const HISTORY_STORAGE_KEY = 'socialContentGeneratorHistory';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Falha ao carregar o histórico do localStorage", error);
      setHistory([]);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Falha ao salvar o histórico no localStorage", error);
    }
  };

  const addToHistory = useCallback((item: { idea: string; tone: Tone; posts: SocialPost[] }) => {
    setHistory(prevHistory => {
      const newHistoryItem: HistoryItem = {
        ...item,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      // Mantém os últimos 20 itens para evitar que o localStorage fique muito grande
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 20); 
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
        console.error("Falha ao limpar o histórico do localStorage", error);
    }
  }, []);

  return { history, addToHistory, clearHistory };
};
