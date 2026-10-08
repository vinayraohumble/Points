import React from 'react';
import { ChildProfile, WorldMilestone, Reward } from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { WORLD_MILESTONES, THEMES } from '../../utils/constants';
import { Flame, Compass, Gift, Trophy, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildHomeProps {
  profile: ChildProfile;
  rewards: Reward[];
  onNavigateTab: (tab: 'home' | 'map' | 'journey' | 'rewards' | 'history') => void;
  onOpenMyBest: () => void;
  onOpenTrophyRoom: () => void;
  onOpenAvatarCustomizer: () => void;
}

export const ChildHome: React.FC<ChildHomeProps> = ({
  profile,
  rewards,
  onNavigateTab,
  onOpenMyBest,
  onOpenTrophyRoom,
  onOpenAvatarCustomizer,
}) => {
  const currentPoints = profile.stats.currentPoints;
  const theme = THEMES[profile.theme];

  // Find current and next world milestone
  let currentMilestone: WorldMilestone = WORLD_MILESTONES[0];
  let nextMilestone: WorldMilestone | null = null;

  for (let i = 0; i < WORLD_MILESTONES.length; i++) {
    if (currentPoints >= WORLD_MILESTONES[i].requiredPoints) {
      currentMilestone = WORLD_MILESTONES[i];
      nextMilestone = WORLD_MILESTONES[i + 1] || null;
    } else {
      break;
    }
  }

  // Calculate progress toward next milestone
  const prevReq = currentMilestone.requiredPoints;
  const nextReq = nextMilestone ? nextMilestone.requiredPoints : prevReq;
  const progressRatio = nextMilestone
    ? Math.min(1, Math.max(0, (currentPoints - prevReq) / (nextReq - prevReq)))
    : 1;
  const pointsRemaining = nextMilestone ? Math.max(0, nextMilestone.requiredPoints - currentPoints) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  // Find next unredeemed reward
  const nextReward =
    rewards.find((r) => r.status === 'available' && r.pointsCost > currentPoints) ||
    rewards.find((r) => r.status === 'available') ||
    rewards[0];

  const rewardProgress = nextReward
    ? Math.min(100, Math.round((currentPoints / nextReward.pointsCost) * 100))
    : 100;

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Hero Explorer Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border backdrop-blur-xl transition-all shadow-xl ${theme.cardBg}`}
      >
        {/* Soft background ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          {/* Avatar with tap to customize */}
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              onOpenAvatarCustomizer();
            }}
            className="group cursor-pointer flex-shrink-0 relative"
            title="Customize your explorer character!"
          >
            <AvatarRenderer avatar={profile.avatar} size="lg" />
            <span className="absolute -bottom-1 -left-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              Level {profile.stats.level}
            </span>
            <span className="sr-only">Customize Character</span>
          </button>

          {/* Child Identity & Big Points */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                {profile.name}
              </h1>
              <span className="text-amber-400 text-lg">✨</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Currently exploring <strong className="text-amber-300">{currentMilestone.name}</strong> {currentMilestone.icon}
            </p>

            {/* Big Numbers Display */}
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
              <div className="bg-amber-400/15 border border-amber-400/30 rounded-2xl px-4 py-2 text-center sm:text-left">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                  Total Points
                </span>
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300">
                  ⭐ {currentPoints.toLocaleString()}
                </span>
              </div>

              {profile.preferences.showRealMoneyToChild && (
                <div className="bg-emerald-400/15 border border-emerald-400/30 rounded-2xl px-4 py-2 text-center sm:text-left">
                  <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                    Piggy Savings
                  </span>
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-300">
                    🪙 {profile.currency}{profile.stats.currentBalance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        {nextMilestone ? (
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2 font-medium">
              <span className="text-slate-200 flex items-center gap-1.5">
                <span>{currentMilestone.icon}</span>
                <strong className="text-white">{currentMilestone.name}</strong>
              </span>
              <span className="text-amber-300 flex items-center gap-1.5">
                <strong className="text-amber-200">{nextMilestone.name}</strong>
                <span>{nextMilestone.icon}</span>
              </span>
            </div>

            {/* Animated progress track */}
            <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/15 relative">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-300 font-semibold">
                {progressPercent}% Complete
              </span>
              <span className="text-amber-300 font-bold">
                🎯 Only {pointsRemaining.toLocaleString()} ⭐ to unlock {nextMilestone.name}!
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-amber-300 font-bold text-sm">
              🌟 You have reached the Pinnacle of the Future World!
            </p>
          </div>
        )}
      </div>

      {/* Motivational Self-Competition Card ("My Best") */}
      <button
        type="button"
        onClick={() => {
          sound.playTap(profile.preferences.soundEnabled);
          onOpenMyBest();
        }}
        className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-teal-950/70 to-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg cursor-pointer transition-all hover:scale-101 group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl flex-shrink-0 group-hover:rotate-6 transition-transform">
              🪞
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Personal Record
                </span>
                <span className="text-xs text-emerald-300">· Beat Your Previous Self!</span>
              </div>
              <p className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                You beat last month! 🎉{' '}
                <span className="text-emerald-300 text-sm font-semibold">
                  {profile.stats.previousMonthPoints} ⭐ ➜ {profile.stats.currentMonthPoints} ⭐ (+
                  {profile.stats.currentMonthPoints - profile.stats.previousMonthPoints})
                </span>
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
      </button>

      {/* Consistency Streak & Quick Trophies Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Streak Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900/60 to-slate-950/80 border border-amber-500/25 flex items-center gap-3.5 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0 animate-bounce">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
              Active Consistency
            </span>
            <div className="font-display font-extrabold text-xl text-white">
              {profile.stats.currentStreak} Day Streak 🔥
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Personal best: {profile.stats.bestStreak} days
            </p>
          </div>
        </div>

        {/* Trophies Quick Access */}
        <button
          type="button"
          onClick={() => {
            sound.playTap(profile.preferences.soundEnabled);
            onOpenTrophyRoom();
          }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-900/60 to-slate-950/80 border border-purple-500/25 hover:border-purple-400/50 flex items-center justify-between gap-3.5 shadow-md text-left cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                Trophy Case
              </span>
              <div className="font-display font-extrabold text-xl text-white">
                8 Badges Earned
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Tap to inspect your honors
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Next Reward Spotlight Card */}
      {nextReward && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                Working Toward Your Next Reward
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                onNavigateTab('rewards');
              }}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              See All Rewards <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-3xl flex-shrink-0">
              {nextReward.icon}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base text-white truncate">
                {nextReward.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {nextReward.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full"
                    style={{ width: `${rewardProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {currentPoints} / {nextReward.pointsCost} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Big Adventure Map Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-blue-950/70 to-slate-900/90 border border-blue-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-2xl flex-shrink-0">
            🗺️
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-white">
              Explore Your Adventure World
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              See the complete 9-stage path from Village to Future World!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap(profile.preferences.soundEnabled);
            onNavigateTab('map');
          }}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-103 transition-transform cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Open World Map</span>
        </button>
      </div>
    </div>
  );
};
