import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Drop-down in the console title bar for switching games. The "N games" badge pulses until the
// visitor opens it once, so it's obvious there is more than one game.
const GamePicker = ({ games, active, onSelect }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const rootRef = useRef(null);

  // Close on a click outside or Escape
  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => {
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((value) => !value);
    setDiscovered(true);
  };

  const select = (index) => {
    onSelect(index);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={t('arcade.menu')}
        className="flex items-center gap-2 max-w-full pl-1 pr-2 py-1 border border-accent/60 hover:border-accent hover:bg-accent/10 transition-colors"
      >
        <span className="relative shrink-0 px-1.5 py-0.5 bg-accent text-white text-[10px] font-bold uppercase tracking-wider">
          {t('arcade.badge').replace('{count}', games.length)}
          {!discovered && <span aria-hidden className="absolute -top-1 -right-1 w-2 h-2 bg-accent animate-ping" />}
        </span>
        <span className="truncate">{games[active].command}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-4rem)] py-1 bg-white dark:bg-black border border-black/20 dark:border-white/20 shadow-[5px_5px_0_0_rgb(var(--c-accent))]">
          {games.map((game, i) => (
            <li key={game.id}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={i === active}
                className={`w-full flex gap-2 px-4 py-2.5 text-left hover:bg-accent/10 transition-colors ${i === active ? 'text-accent' : ''}`}
              >
                <span aria-hidden className="w-3 shrink-0">{i === active ? '>' : ''}</span>
                <span className="min-w-0">
                  <span className="block font-bold truncate">{game.command}</span>
                  <span className="block text-[11px] opacity-60">{t(`arcade.games.${game.id}.tagline`)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GamePicker;
