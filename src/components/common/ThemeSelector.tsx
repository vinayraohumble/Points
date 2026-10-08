import React from 'react';
import { THEMES } from '../../utils/constants';
import { AdventureTheme } from '../../types';
import { sound } from '../../utils/audio';

interface ThemeSelectorProps {
  currentTheme: AdventureTheme;
  onSelectTheme: (theme: AdventureTheme) => void;
  soundEnabled?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  soundEnabled = true,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {(Object.keys(THEMES) as AdventureTheme[]).map((key) => {
        const theme = THEMES[key];
        const isSelected = currentTheme === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              sound.playTap(soundEnabled);
              onSelectTheme(key);
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              isSelected
                ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-102'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-2xl mb-1">{theme.icon}</span>
            <span className="text-xs font-semibold text-white truncate max-w-full">
              {theme.name}
            </span>
            <span className="text-[10px] text-slate-300/80 mt-0.5 line-clamp-1">
              {theme.emoji} {key}
            </span>
          </button>
        );
      })}
    </div>
  );
};
