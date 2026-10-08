import React from 'react';
import { ChildAccount } from '../../types';
import { AvatarRenderer } from './AvatarRenderer';
import { Plus, Check, Shield, Sparkles, X, ChevronRight, Compass } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ProfilePickerModalProps {
  childrenAccounts: ChildAccount[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  onAddNewChild: () => void;
  onOpenParentMode: () => void;
  onClose?: () => void;
  soundEnabled?: boolean;
}

export const ProfilePickerModal: React.FC<ProfilePickerModalProps> = ({
  childrenAccounts,
  activeChildId,
  onSelectChild,
  onAddNewChild,
  onOpenParentMode,
  onClose,
  soundEnabled = true,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl text-amber-300">
              🧭
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">
                Who is adventuring today?
              </h3>
              <p className="text-xs text-slate-300">
                Pick an explorer to enter their personal journal
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Child Profiles Grid */}
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {childrenAccounts.map((acc) => {
            const isSelected = acc.profile.id === activeChildId;
            return (
              <button
                key={acc.profile.id}
                type="button"
                onClick={() => {
                  sound.playStarSparkle(soundEnabled);
                  onSelectChild(acc.profile.id);
                  if (onClose) onClose();
                }}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative group flex items-center gap-4 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-102'
                    : 'bg-slate-950/70 border-white/10 hover:border-white/25 hover:bg-slate-950 hover:scale-101'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <AvatarRenderer avatar={acc.profile.avatar} size="lg" />
                  <span className="absolute -bottom-1 -left-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                    Lvl {acc.profile.stats.level}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-extrabold text-base text-white truncate group-hover:text-amber-300 transition-colors">
                      {acc.profile.name}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">
                    {acc.profile.schoolGrade} · Age {acc.profile.currentAge}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-amber-300">
                      ⭐ {acc.profile.stats.currentPoints.toLocaleString()}
                    </span>
                    {acc.profile.preferences.showRealMoneyToChild && (
                      <>
                        <span className="text-slate-500">·</span>
                        <span className="font-bold text-emerald-400">
                          {acc.profile.currency}{acc.profile.stats.currentBalance.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Add Another Child Button */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              sound.playTap(soundEnabled);
              onAddNewChild();
            }}
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Another Child Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap(soundEnabled);
              onOpenParentMode();
              if (onClose) onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Parent Vault (Manage All Profiles)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
