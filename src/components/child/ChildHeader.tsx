import React from 'react';
import { ChildProfile, AdventureTheme } from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { Volume2, VolumeX, Music, Shield, Sparkles, Users } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildHeaderProps {
  profile: ChildProfile;
  currentTheme: AdventureTheme;
  onOpenParentMode: () => void;
  onOpenProfilePicker: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenAvatarCustomizer: () => void;
  onOpenThemeSelector: () => void;
}

export const ChildHeader: React.FC<ChildHeaderProps> = ({
  profile,
  currentTheme,
  onOpenParentMode,
  onOpenProfilePicker,
  onToggleSound,
  onToggleMusic,
  onOpenAvatarCustomizer,
  onOpenThemeSelector,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/75 border-b border-white/10 px-4 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Child Avatar & Level identity */}
        <button
          type="button"
          onClick={() => {
            sound.playTap(profile.preferences.soundEnabled);
            onOpenAvatarCustomizer();
          }}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          title="Click to customize avatar wardrobe"
        >
          <div className="relative">
            <AvatarRenderer avatar={profile.avatar} size="sm" showCompanion={false} />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1 rounded-full border border-white">
              L{profile.stats.level}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-white text-sm sm:text-base tracking-wide group-hover:text-amber-300 transition-colors">
                {profile.nickname || profile.name}
              </span>
              <span className="text-[11px] text-amber-400 font-medium hidden sm:inline">
                · {profile.schoolGrade}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <span className="font-semibold text-amber-300">⭐ {profile.stats.currentPoints}</span>
              {profile.preferences.showRealMoneyToChild && (
                <>
                  <span className="text-slate-500">·</span>
                  <span className="font-semibold text-emerald-400">
                    {profile.currency}{profile.stats.currentBalance.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>

        {/* Zone 2: Audio & Theme controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              onOpenThemeSelector();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Change Adventure World Theme"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              profile.preferences.soundEnabled
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={profile.preferences.soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            {profile.preferences.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition-colors ${
              profile.preferences.musicEnabled
                ? 'bg-purple-400/10 border-purple-400/30 text-purple-400 animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={profile.preferences.musicEnabled ? 'Ambient Music Playing' : 'Ambient Music Paused'}
          >
            <Music className="w-4 h-4" />
          </button>
        </div>

        {/* Zone 3: Switch Explorer & Secure Parent Mode Action */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              onOpenProfilePicker();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold shadow-sm transition-all hover:scale-102 cursor-pointer"
            title="Switch Child Explorer"
          >
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Switch Child</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              onOpenParentMode();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Parent Mode</span>
            <span className="xs:hidden">Parent</span>
          </button>
        </div>
      </div>
    </header>
  );
};
