import { useState, useCallback, useEffect } from 'react';

interface UseClipboardResult {
  copiedId: number | null;
  copyToClipboard: (content: string, id: number) => Promise<void>;
}

export const useClipboard = (): UseClipboardResult => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const copyToClipboard = useCallback(async (content: string, id: number) => {
    try {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Handle HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";

      // Try using the modern Clipboard API first
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textContent);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedId(id);
      // Set new timeout and store its ID
      const newTimeoutId = setTimeout(() => setCopiedId(null), 2000);
      setTimeoutId(newTimeoutId);
    } catch (err) {
      console.error('Failed to copy:', err);
      throw new Error('Failed to copy to clipboard');
    }
  }, [timeoutId]);

  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return { copiedId, copyToClipboard };
};
