import React from 'react';
import { ChildAccount } from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { THEMES } from '../../utils/constants';
import { sound } from '../../utils/audio';
import { X, Plus, Sparkles, Check, Compass, Star, Wallet, Award } from 'lucide-react';

interface ProfilePickerModalProps {
  childrenAccounts: ChildAccount[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  onAddNewChild: () => void;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const ProfilePickerModal: React.FC<ProfilePickerModalProps> = ({
  childrenAccounts,
  activeChildId,
  onSelectChild,
  onAddNewChild,
  onClose,
  soundEnabled = true,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                Who is Exploring Today?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Switch child profile to view personal adventure journal, coins & 10-year journey
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playTap(soundEnabled);
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles Grid */}
        <div className="py-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {childrenAccounts.map((account) => {
            const { profile, transactions } = account;
            const isActive = profile.id === activeChildId;
            const themeConfig = THEMES[profile.theme] || THEMES.mountain;

            return (
              <div
                key={profile.id}
                onClick={() => {
                  sound.playStarSparkle(soundEnabled);
                  onSelectChild(profile.id);
                  onClose();
                }}
                className={`relative group rounded-2xl p-5 border cursor-pointer transition-all duration-200 transform hover:scale-[1.02] flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-white/10 hover:border-white/25 shadow-md'
                }`}
              >
                {/* Active Indicator Ribbon */}
                {isActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active Now</span>
                  </div>
                )}

                {/* Profile Identity */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <AvatarRenderer avatar={profile.avatar} size="lg" />
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-sm">
                      L{profile.stats.level}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-extrabold text-lg text-white group-hover:text-amber-300 transition-colors truncate">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium truncate">
                      "{profile.nickname}" · {profile.schoolGrade}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px]">
                        {themeConfig.icon} {themeConfig.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Balance & Stats Preview */}
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                      ⭐
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Stars / Points</span>
                      <span className="font-extrabold text-amber-300 text-sm">
                        {profile.stats.currentPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold">
                      🪙
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Real Savings</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {profile.currency}{profile.stats.currentBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tap to switch action prompt */}
                <div className="mt-3 text-center">
                  <span
                    className={`text-[11px] font-bold ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {isActive ? 'Currently Playing as ' + profile.name : 'Switch to ' + profile.name + ' →'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add Another Child Card */}
          <div
            onClick={() => {
              sound.playTap(soundEnabled);
              onClose();
              onAddNewChild();
            }}
            className="rounded-2xl p-6 border-2 border-dashed border-white/20 hover:border-amber-400/70 bg-white/5 hover:bg-amber-400/5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center group min-h-[200px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-inner">
              <Plus className="w-7 h-7" />
            </div>
            <h4 className="font-display font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
              Add Another Child
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Set up a separate 10-year piggy bank, avatar & milestones
            </p>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>Parent Vault manages all children using one security PIN</span>
          <button
            type="button"
            onClick={() => {
              sound.playTap(soundEnabled);
              onClose();
              onAddNewChild();
            }}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            + New Child Setup Wizard
          </button>
        </div>
      </div>
    </div>
  );
};
