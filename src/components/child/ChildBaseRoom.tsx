import React, { useState } from 'react';
import { ChildProfile, BaseFurnitureItem } from '../../types';
import { DEFAULT_BASE_ITEMS } from '../../utils/constants';
import { Lock, CheckCircle2, Sparkles, X, Home, Info } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildBaseRoomProps {
  profile: ChildProfile;
}

export const ChildBaseRoom: React.FC<ChildBaseRoomProps> = ({ profile }) => {
  const [selectedItem, setSelectedItem] = useState<BaseFurnitureItem | null>(null);
  const currentLevel = profile.stats.level;

  const unlockedCount = DEFAULT_BASE_ITEMS.filter((item) => currentLevel >= item.levelRequired).length;

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center pt-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide flex items-center justify-center gap-2">
          <span>🏠</span> My Explorer Sanctuary
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Every level you gain expands your personal room with furniture, books, and trophies!
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{unlockedCount} of {DEFAULT_BASE_ITEMS.length} Room Wonders Unlocked</span>
        </div>
      </div>

      {/* Visual Room Grid / Isometric Sanctuary Display */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/15 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {DEFAULT_BASE_ITEMS.map((item) => {
            const isUnlocked = currentLevel >= item.levelRequired;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  setSelectedItem(item);
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-amber-400/40 hover:border-amber-400 hover:scale-103 shadow-md'
                    : 'bg-slate-950/60 border-white/5 opacity-55 hover:opacity-85'
                }`}
              >
                <div className="relative mb-2">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 ${
                      isUnlocked
                        ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {isUnlocked ? (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow">
                      ✓
                    </span>
                  ) : (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] border border-white/10 shadow">
                      🔒
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isUnlocked ? 'Unlocked' : `Requires Level ${item.levelRequired}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl mb-3 shadow-inner">
              {selectedItem.icon}
            </div>

            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Sanctuary Artifact
            </div>

            <h3 className="font-display font-extrabold text-xl text-white mt-1">
              {selectedItem.name}
            </h3>

            <p className="text-xs text-slate-300 mt-2 px-2">
              {selectedItem.description}
            </p>

            {currentLevel >= selectedItem.levelRequired ? (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                ✨ {selectedItem.unlockedStory}
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-slate-300">
                🔒 Locked. Reach <strong>Level {selectedItem.levelRequired}</strong> (you are currently Level {currentLevel}) by accumulating {Math.max(0, (selectedItem.levelRequired - 1) * 150 - profile.stats.currentPoints)} more points!
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Back to Sanctuary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
