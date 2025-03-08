import { useEffect, useCallback } from 'react';

type NavigationHandler = (direction: 'next' | 'prev') => void;

export function useKeyboardNavigation(
  isEnabled: boolean,
  navigationHandler: NavigationHandler,
  togglePlayHandler: () => void
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEnabled) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          navigationHandler('next');
          break;
        case 'ArrowLeft':
          navigationHandler('prev');
          break;
        case 'p':
        case 'P':
          togglePlayHandler();
          break;
        default:
          break;
      }
    },
    [isEnabled, navigationHandler, togglePlayHandler]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
}
