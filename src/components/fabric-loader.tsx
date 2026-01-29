'use client';

import { useEffect } from 'react';

export function FabricLoader() {
  useEffect(() => {
    // Check if already loaded
    if (typeof window.fabric !== 'undefined') {
      // Dispatch event anyway in case components are waiting
      window.dispatchEvent(new Event('fabricReady'));
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="fabric"]');
    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (typeof window.fabric !== 'undefined') {
          clearInterval(checkLoaded);
          window.dispatchEvent(new Event('fabricReady'));
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Create and inject script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
    script.async = false; // Load synchronously to ensure it's available before React components init

    script.onload = () => {
      // Dispatch custom event so canvas component knows fabric is ready
      window.dispatchEvent(new Event('fabricReady'));
    };

    script.onerror = () => {
      // Silent fail - error will be caught by canvas initialization
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
