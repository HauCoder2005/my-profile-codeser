import { useEffect, useState } from 'react';

// Theme colours for the 3D scenes (match --c-white / --c-black in index.css)
export const PALETTE = {
  dark: { fg: '#ffffff', bg: '#000000', moonCore: '#333333', moonWire: '#888888', atmosphere: '#7fb4ff' },
  light: { fg: '#1c1915', bg: '#f4efe3', moonCore: '#a39e92', moonWire: '#1c1915', atmosphere: '#1c1915' },
};

// Follows the `dark` / `light` class that Navbar toggles on <html>
export const useIsDark = () => {
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains('light'));
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(!root.classList.contains('light'));
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
};
