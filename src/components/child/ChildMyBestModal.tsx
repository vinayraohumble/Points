import React from 'react';
import { ChildProfile } from '../../types';
import { X, TrendingUp, Flame, Star, Award, ShieldCheck, Heart } from 'lucide-react';

interface ChildMyBestModalProps {
  profile: ChildProfile;
  onClose: () => void;
}

export const ChildMyBestModal: React.FC<ChildMyBestModalProps> = ({ profile, onClose }) => {
  const stats = profile.stats;
  const monthImprovement = stats.currentMonthPoints - stats.previousMonthPoints;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl">
              🪞
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">
                My Personal Best
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">
                Compete with your previous self, not with others!
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

        {/* Core Philosophy Quote Card */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
          <p className="text-xs sm:text-sm text-emerald-200 font-medium">
            🌟 “The only explorer you need to beat is who you were yesterday.”
          </p>
        </div>

        {/* Comparison Metrics */}
        <div className="mt-4 space-y-3">
          {/* Month vs Month Improvement */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl">
                📈
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Monthly Improvement
                </span>
                <span className="font-display font-bold text-sm text-white">
                  Last Month: {stats.previousMonthPoints} ⭐ ➜ This Month: {stats.currentMonthPoints} ⭐
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
                +{monthImprovement} ⭐
              </span>
            </div>
          </div>

          {/* Best Month Record */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-400/20 border border-purple-400/30 flex items-center justify-center text-xl">
                ⭐
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  All-Time Best Month
                </span>
                <span className="font-display font-bold text-base text-white">
                  {stats.bestMonthPoints.toLocaleString()} Points
                </span>
              </div>
            </div>
            <span className="text-xs text-purple-300 font-bold">New Record! 🎉</span>
          </div>

          {/* Longest Streak */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl">
                🔥
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Consistency Streak
                </span>
                <span className="font-display font-bold text-sm text-white">
                  Current: {stats.currentStreak} Days · Record: {stats.bestStreak} Days
                </span>
              </div>
            </div>
            <span className="text-xs text-amber-300 font-bold">Keep Glowing!</span>
          </div>

          {/* Longest Saving Period */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl">
                🛡️
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Patience Discipline
                </span>
                <span className="font-display font-bold text-sm text-white">
                  12 Straight Months of Piggy Savings
                </span>
              </div>
            </div>
            <span className="text-xs text-teal-300 font-bold">Master Saver</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            I'm Ready to Keep Growing!
          </button>
        </div>
      </div>
    </div>
  );
};
