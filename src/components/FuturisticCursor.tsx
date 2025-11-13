'use client';

import { useEffect } from 'react';

export default function NormalCursor() {
  useEffect(() => {
    // Ensure the default cursor is used
    document.documentElement.style.cursor = '';

    return () => {
      // Cleanup if needed
      document.documentElement.style.cursor = '';
    };
  }, []);

  return null; // No visual component needed
}