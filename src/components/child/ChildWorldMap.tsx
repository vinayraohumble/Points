import React, { useState } from 'react';
import { WorldMilestone, ChildProfile } from '../../types';
import { WORLD_MILESTONES, THEMES } from '../../utils/constants';
import { Lock, CheckCircle2, Sparkles, MapPin, X } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildWorldMapProps {
  profile: ChildProfile;
}

export const ChildWorldMap: React.FC<ChildWorldMapProps> = ({ profile }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<WorldMilestone | null>(null);
  const currentPoints = profile.stats.currentPoints;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Map Banner */}
      <div className="text-center max-w-xl mx-auto pt-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide flex items-center justify-center gap-2">
          <span>🗺️</span> The Adventure Map
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Every point you earn guides your explorer further into uncharted wonders.
        </p>
      </div>

      {/* The Visual Trail Map */}
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {/* Curving winding trail line */}
        <div className="absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-2.5 bg-gradient-to-b from-emerald-500 via-amber-400 to-purple-600 rounded-full opacity-60 shadow-lg" />

        <div className="relative space-y-12">
          {WORLD_MILESTONES.map((milestone, idx) => {
            const isUnlocked = currentPoints >= milestone.requiredPoints;
            const isCurrent =
              isUnlocked &&
              (idx === WORLD_MILESTONES.length - 1 ||
                currentPoints < WORLD_MILESTONES[idx + 1].requiredPoints);
            const isEven = idx % 2 === 0;

            return (
              <div
                key={milestone.id}
                className={`relative flex items-center ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                } gap-4 sm:gap-8`}
              >
                {/* Node Center Marker on the Path */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap(profile.preferences.soundEnabled);
                      setSelectedMilestone(milestone);
                    }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 border-white ring-4 ring-amber-400/50 scale-125 shadow-xl animate-pulse'
                        : isUnlocked
                        ? 'bg-emerald-600 border-emerald-300 shadow-md hover:scale-110'
                        : 'bg-slate-900 border-slate-700 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <span>{milestone.icon}</span>
                  </button>
                  {isCurrent && (
                    <span className="absolute -top-7 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow whitespace-nowrap animate-bounce flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 fill-slate-950" /> You Are Here
                    </span>
                  )}
                </div>

                {/* Milestone Detail Card on the side */}
                <div className={`w-[calc(50%-2rem)] ${isEven ? 'text-right' : 'text-left'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap(profile.preferences.soundEnabled);
                      setSelectedMilestone(milestone);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer w-full group ${
                      isCurrent
                        ? 'bg-amber-950/60 border-amber-400/60 shadow-lg ring-1 ring-amber-400/30'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400/50 shadow-md'
                        : 'bg-slate-950/60 border-white/5 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        World {milestone.worldIndex}
                      </span>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base text-white truncate group-hover:text-amber-300 transition-colors">
                      {milestone.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <span className="font-semibold text-amber-300">
                        {milestone.requiredPoints === 0 ? 'Start' : `${milestone.requiredPoints.toLocaleString()} ⭐`}
                      </span>
                      {!isUnlocked && (
                        <span className="text-[10px] text-slate-400">
                          ({milestone.requiredPoints - currentPoints} more)
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Empty spacer for the opposite side */}
                <div className="w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Inspection Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden">
            {/* Header with Close */}
            <button
              type="button"
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl shadow-inner mb-3">
                {selectedMilestone.icon}
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                World Stage {selectedMilestone.worldIndex}
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white mt-1">
                {selectedMilestone.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 px-2">
                {selectedMilestone.description}
              </p>
            </div>

            {/* Story / Discovery Quote */}
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-amber-200/90 italic text-center">
              “{selectedMilestone.storyUnlocked}”
            </div>

            {/* Badge Unlocked Info */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏆</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Honor Badge
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedMilestone.badgeName}
                  </span>
                </div>
              </div>

              {currentPoints >= selectedMilestone.requiredPoints ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Unlocked ✨
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-white/5">
                  Locked ({selectedMilestone.requiredPoints - currentPoints} ⭐ needed)
                </span>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Continue Adventure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
