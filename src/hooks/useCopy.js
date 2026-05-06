import { useEffect, useState } from 'react';

function useCopy() {
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!copiedId) return undefined;

    const timer = window.setTimeout(() => {
      setCopiedId(null);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [copiedId]);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
    } catch (error) {
      console.error('Clipboard copy failed', error);
    }
  };

  return { copiedId, copyToClipboard };
}

export default useCopy;
