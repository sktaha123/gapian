import { useEffect, useCallback } from 'react';

/**
 * A hook to handle mobile back button / browser back button
 * gracefully, without losing page state.
 * 
 * Usage:
 * useBackButton(isOpen, onClose);
 */
export function useBackButton(isOpen, onClose) {
  const handlePopState = useCallback((event) => {
    if (isOpen) {
      // Prevent navigation and close the modal/flow instead
      event.preventDefault();
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Push a new state to the history stack so the back button has something to pop
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Note: We don't pop the state here automatically on unmount 
      // because the user might have closed it via a UI button,
      // and we want to keep the history clean. 
      // But a more robust approach is sometimes needed.
    };
  }, [isOpen, handlePopState]);
}
