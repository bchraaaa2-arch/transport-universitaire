import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');

  // Au chargement, lire le thème sauvegardé
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return { theme, toggle };
}
