import { useCallback, useState } from 'react';
import * as storage from '../services/storageService.js';

export function useSavedIdeas() {
  const [savedIds, setSavedIds] = useState(() =>
    new Set(storage.getSavedIdeas().map(i => i.id))
  );

  const saveIdea = useCallback((idea) => {
    storage.saveIdea(idea);
    setSavedIds(prev => new Set([...prev, idea.id]));
  }, []);

  const unsaveIdea = useCallback((id) => {
    storage.unsaveIdea(id);
    setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  }, []);

  const toggleSave  = useCallback((idea) => {
    savedIds.has(idea.id) ? unsaveIdea(idea.id) : saveIdea(idea);
  }, [savedIds, saveIdea, unsaveIdea]);

  const isSaved     = useCallback((id) => savedIds.has(id), [savedIds]);
  const getSaved    = useCallback(() => storage.getSavedIdeas(), []);
  // expose unsave-by-id for the vault panel (no full object needed)
  const unsaveById  = unsaveIdea;

  return { isSaved, toggleSave, getSaved, unsaveById };
}
