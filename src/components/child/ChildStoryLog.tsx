import React from 'react';
import { Transaction, ChildProfile } from '../../types';
import { Sparkles, Calendar, Heart, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ChildStoryLogProps {
  profile: ChildProfile;
  transactions: Transaction[];
}

export const ChildStoryLog: React.FC<ChildStoryLogProps> = ({ profile, transactions }) => {
  // Sort most recent first
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="text-center pt-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide flex items-center justify-center gap-2">
          <span>📖</span> My Adventure Story Log
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Every star earned and coin saved holds a special memory of your growth.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-white/10">
          <div className="text-4xl mb-2">🌱</div>
          <h3 className="font-display font-bold text-lg text-white">Your Story Starts Today</h3>
          <p className="text-xs text-slate-300 mt-1">
            As you achieve goals and save coins, your story chapters will appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((tx) => {
            const date = new Date(tx.timestamp);
            const formattedDate = date.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            const isPoints = tx.type === 'points';
            const isAdd = tx.direction === 'add';

            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-white/20 transition-all shadow-md flex items-start gap-3.5"
              >
                {/* Visual Category / Type Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl flex-shrink-0 ${
                    isPoints
                      ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                      : 'bg-emerald-400/20 border-emerald-400/30 text-emerald-300'
                  }`}
                >
                  {isPoints ? '⭐' : '🪙'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-300 truncate">
                      {tx.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-3 h-3" /> {formattedDate}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white">
                    {tx.reason}
                  </h4>

                  {/* Heart-warming memory note if present */}
                  {tx.memoryNote && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-amber-200/90 flex items-start gap-2">
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40 flex-shrink-0 mt-0.5" />
                      <span className="italic">“{tx.memoryNote}”</span>
                    </div>
                  )}
                </div>

                {/* Amount Change */}
                <div className="text-right flex-shrink-0 pl-1">
                  <span
                    className={`font-display font-extrabold text-sm sm:text-base ${
                      isAdd ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    {isAdd ? '+' : '−'}
                    {isPoints ? `${tx.amount} ⭐` : `${profile.currency}${tx.amount}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
