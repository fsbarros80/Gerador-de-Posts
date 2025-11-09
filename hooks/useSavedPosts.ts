import { useState, useEffect, useCallback } from 'react';
import { SavedPost, Platform } from '../types';

const SAVED_POSTS_STORAGE_KEY = 'socialContentGeneratorSavedPosts';

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(SAVED_POSTS_STORAGE_KEY);
      if (storedPosts) {
        setSavedPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      console.error("Falha ao carregar posts salvos do localStorage", error);
      setSavedPosts([]);
    }
  }, []);

  const savePostsToStorage = (posts: SavedPost[]) => {
    try {
      localStorage.setItem(SAVED_POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Falha ao salvar posts no localStorage", error);
    }
  };

  const isPostSaved = useCallback((postToCheck: { mediaUrl: string }) => {
    if (!postToCheck.mediaUrl) return false;
    return savedPosts.some((p) => p.mediaUrl === postToCheck.mediaUrl);
  }, [savedPosts]);

  const toggleSavePost = useCallback((postData: {
    platform: Platform;
    content: string;
    mediaUrl: string;
    mediaType: 'image';
    imagePrompt: string;
  }) => {
    setSavedPosts(prevPosts => {
      const existingPostIndex = prevPosts.findIndex(
        p => p.mediaUrl === postData.mediaUrl
      );

      let updatedPosts;
      if (existingPostIndex > -1) {
        // Remove o post se já estiver salvo
        updatedPosts = prevPosts.filter((_, index) => index !== existingPostIndex);
      } else {
        // Adiciona o post se não estiver salvo
        const newSavedPost: SavedPost = {
          ...postData,
          id: Date.now(),
          savedAt: new Date().toISOString(),
        };
        updatedPosts = [newSavedPost, ...prevPosts];
      }
      
      savePostsToStorage(updatedPosts);
      return updatedPosts;
    });
  }, []);
  
  const removeSavedPost = useCallback((postId: number) => {
    setSavedPosts(prevPosts => {
        const updatedPosts = prevPosts.filter(p => p.id !== postId);
        savePostsToStorage(updatedPosts);
        return updatedPosts;
    });
  }, []);

  return { savedPosts, toggleSavePost, isPostSaved, removeSavedPost };
};