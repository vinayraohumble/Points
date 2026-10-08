import React, { useState } from 'react';
import { Reward, ChildProfile } from '../../types';
import { Gift, CheckCircle2, Clock, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildRewardsProps {
  profile: ChildProfile;
  rewards: Reward[];
  onRequestRedeem: (rewardId: string) => void;
}

export const ChildRewards: React.FC<ChildRewardsProps> = ({
  profile,
  rewards,
  onRequestRedeem,
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'progress' | 'redeemed'>('all');
  const currentPoints = profile.stats.currentPoints;

  const filteredRewards = rewards.filter((r) => {
    if (filter === 'ready') return r.status === 'available' && currentPoints >= r.pointsCost;
    if (filter === 'progress') return r.status === 'available' && currentPoints < r.pointsCost;
    if (filter === 'redeemed') return r.status === 'redeemed';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto pt-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide flex items-center justify-center gap-2">
          <span>🎁</span> The Reward Chest
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Pick your goals! As you gather adventure points, your treasures unlock.
        </p>

        {/* Filter buttons */}
        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Treasures' },
            { id: 'ready', label: '⭐ Ready to Claim' },
            { id: 'progress', label: '🎯 In Progress' },
            { id: 'redeemed', label: '🏆 Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                setFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      {filteredRewards.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-white/10 max-w-md mx-auto">
          <div className="text-4xl mb-2">🎁</div>
          <h3 className="font-display font-bold text-lg text-white">No Treasures Here Yet</h3>
          <p className="text-xs text-slate-300 mt-1">
            Ask your parent in Parent Mode to add rewards that motivate you!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {filteredRewards.map((reward) => {
            const canAfford = currentPoints >= reward.pointsCost;
            const progress = Math.min(100, Math.round((currentPoints / reward.pointsCost) * 100));
            const isRedeemed = reward.status === 'redeemed';
            const isRequested = reward.status === 'requested';
            const isApproved = reward.status === 'approved';

            return (
              <div
                key={reward.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isRedeemed
                    ? 'bg-slate-950/60 border-white/5 opacity-75'
                    : canAfford
                    ? 'bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900/90 border-amber-400/50 shadow-lg hover:border-amber-400'
                    : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                      {reward.icon}
                    </div>

                    <div className="text-right">
                      <span className="font-display font-extrabold text-base text-amber-300 block">
                        ⭐ {reward.pointsCost.toLocaleString()}
                      </span>
                      {reward.moneyCost && (
                        <span className="text-[11px] text-emerald-400 font-semibold block">
                          + {profile.currency}{reward.moneyCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">{reward.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{reward.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  {isRedeemed ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked & Redeemed!</span>
                    </div>
                  ) : isRequested ? (
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold bg-amber-400/10 p-2 rounded-xl">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Waiting for Parent's Approval ✨</span>
                    </div>
                  ) : isApproved ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-bold">Approved by Parent! 🎉</span>
                      <span className="text-slate-400">Collect with Mom/Dad</span>
                    </div>
                  ) : (
                    <div>
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
                        <span>{progress}% Progress</span>
                        <span>
                          {canAfford
                            ? 'Goal Achieved! 🌟'
                            : `${reward.pointsCost - currentPoints} ⭐ to go`}
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10 mb-3">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            canAfford
                              ? 'bg-gradient-to-r from-emerald-400 to-amber-300'
                              : 'bg-amber-400/70'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {canAfford ? (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playChestOpen(profile.preferences.soundEnabled);
                            onRequestRedeem(reward.id);
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Gift className="w-4 h-4" />
                          <span>Request This Reward!</span>
                        </button>
                      ) : (
                        <div className="text-center py-1 text-xs text-slate-400 flex items-center justify-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Collect more stars to unlock</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
