import React, { useState } from 'react';
import { Achievement, ChildProfile } from '../../types';
import { Trophy, CheckCircle2, Lock, X } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildTrophyRoomProps {
  profile: ChildProfile;
  achievements: Achievement[];
  onClose: () => void;
}

export const ChildTrophyRoom: React.FC<ChildTrophyRoomProps> = ({
  profile,
  achievements,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filtered = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">
                Trophy Hall of Honors
              </h3>
              <p className="text-xs text-slate-300">
                {unlockedCount} of {achievements.length} Badges Unlocked
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 py-3 flex-shrink-0">
          {[
            { id: 'all', label: `All (${achievements.length})` },
            { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
            { id: 'locked', label: `In Progress (${achievements.length - unlockedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                setFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trophies Grid Scrollable */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1 py-1">
          {filtered.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  ach.unlocked
                    ? 'bg-amber-950/20 border-amber-400/30 shadow-sm'
                    : 'bg-slate-950/40 border-white/5 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl flex-shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-400/20 border-amber-400/40 text-amber-300 shadow-inner'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display font-bold text-base text-white truncate">
                      {ach.title}
                    </h4>
                    {ach.unlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold flex items-center gap-1 flex-shrink-0">
                        <Lock className="w-3 h-3" /> {ach.progress}/{ach.maxProgress}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-0.5">{ach.description}</p>

                  {!ach.unlocked && (
                    <div className="mt-2 w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-amber-400/70 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
