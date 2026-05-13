import { useCallback, useState } from 'react';
import * as storage from '../services/storageService.js';

export function useSearchHistory() {
  const [history, setHistory] = useState(() => storage.getSearchHistory());

  const addEntry = useCallback((query, count) => {
    storage.addSearchHistory({ query, count, timestamp: Date.now() });
    setHistory(storage.getSearchHistory());
  }, []);

  const removeEntry = useCallback((query) => {
    storage.removeHistoryItem(query);
    setHistory(storage.getSearchHistory());
  }, []);

  const clearAll = useCallback(() => {
    storage.clearSearchHistory();
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearAll };
}
