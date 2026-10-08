import React, { useState, useRef } from 'react';
import { ChildAvatar, ChildProfile, CompanionType, AccessoryType } from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { PRESET_CHILD_PORTRAITS } from '../../utils/constants';
import { X, Check, Camera, Upload, Trash2, Sparkles, UserCheck } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildAvatarCustomizerProps {
  profile: ChildProfile;
  onUpdateAvatar: (avatar: ChildAvatar) => void;
  onClose: () => void;
}

export const ChildAvatarCustomizer: React.FC<ChildAvatarCustomizerProps> = ({
  profile,
  onUpdateAvatar,
  onClose,
}) => {
  const [avatar, setAvatar] = useState<ChildAvatar>({ ...profile.avatar });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hairStyles = [
    { id: 'twin_braids', label: 'Twin Braids' },
    { id: 'ponytail', label: 'Ponytail' },
    { id: 'curls', label: 'Curls' },
    { id: 'spiky', label: 'Explorer Bob' },
  ];

  const outfitColors = [
    { color: '#0284C7', label: 'Sapphire' },
    { color: '#059669', label: 'Emerald' },
    { color: '#D97706', label: 'Amber' },
    { color: '#E11D48', label: 'Ruby' },
    { color: '#7C3AED', label: 'Amethyst' },
    { color: '#0F172A', label: 'Midnight' },
  ];

  const accessories: { id: AccessoryType; label: string; icon: string }[] = [
    { id: 'explorer_hat', label: 'Explorer Hat', icon: '🤠' },
    { id: 'goggles', label: 'Pilot Goggles', icon: '🥽' },
    { id: 'cape', label: 'Hero Cape', icon: '🦸' },
    { id: 'headphones', label: 'Beats Headphones', icon: '🎧' },
    { id: 'crown', label: 'Golden Crown', icon: '👑' },
    { id: 'none', label: 'No Hat', icon: '✨' },
  ];

  const companions: { id: CompanionType; label: string; icon: string }[] = [
    { id: 'dragon', label: 'Spark the Dragon', icon: '🐲' },
    { id: 'robot', label: 'Nova the Robot', icon: '🤖' },
    { id: 'panda', label: 'Pip the Panda', icon: '🐼' },
    { id: 'dog', label: 'Astro the Puppy', icon: '🐶' },
    { id: 'cat', label: 'Cosmo the Cat', icon: '🐱' },
    { id: 'fox', label: 'Finch the Fox', icon: '🦊' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit ~5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        sound.playStarSparkle(profile.preferences.soundEnabled);
        setAvatar((prev) => ({
          ...prev,
          photoType: 'custom',
          customPhotoUrl: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    sound.playTap(profile.preferences.soundEnabled);
    setAvatar((prev) => ({
      ...prev,
      photoType: 'avatar',
      customPhotoUrl: undefined,
    }));
  };

  const handleSave = () => {
    sound.playStarSparkle(profile.preferences.soundEnabled);
    onUpdateAvatar(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">
              Explorer Identity & Portrait
            </h3>
            <p className="text-xs text-slate-300">
              Upload real photo or pick an adventure character!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="py-3 text-center flex-shrink-0 bg-slate-950/60 rounded-2xl border border-white/5 my-2.5 flex flex-col items-center">
          <AvatarRenderer avatar={avatar} size="xl" />
          <span className="text-xs font-bold text-amber-300 mt-1.5 block">
            {profile.name} & {companions.find((c) => c.id === avatar.companion)?.label}
          </span>
          <span className="text-[10px] text-slate-400">
            {avatar.photoType === 'custom'
              ? 'Real Uploaded Photo Active'
              : avatar.photoType === 'portrait_girl' || avatar.photoType === 'portrait_boy'
              ? 'AI Adventure Portrait Active'
              : 'Illustrated Character Active'}
          </span>
        </div>

        {/* Customization Options Scrollable */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 py-1 text-xs">
          {/* PHOTO OR AVATAR SELECTION */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Child Profile Photo
              </label>
              {avatar.customPhotoUrl && (
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove Photo
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Option 1: Upload real photo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  avatar.photoType === 'custom'
                    ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Upload className="w-5 h-5 text-amber-400 mb-1" />
                <span className="font-bold text-[11px] block">Upload Real Photo</span>
                <span className="text-[9px] text-slate-400">From Device</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Option 2: Harshita Portrait */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  setAvatar({
                    ...avatar,
                    photoType: 'portrait_girl',
                    customPhotoUrl: PRESET_CHILD_PORTRAITS.portrait_girl,
                  });
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  avatar.photoType === 'portrait_girl'
                    ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden mb-1 border border-white/20">
                  <img
                    src={PRESET_CHILD_PORTRAITS.portrait_girl}
                    alt="Girl Portrait"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-[11px] block">Harshita Portrait</span>
                <span className="text-[9px] text-slate-400">Girl Explorer</span>
              </button>

              {/* Option 3: Boy Explorer Portrait */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  setAvatar({
                    ...avatar,
                    photoType: 'portrait_boy',
                    customPhotoUrl: PRESET_CHILD_PORTRAITS.portrait_boy,
                  });
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  avatar.photoType === 'portrait_boy'
                    ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden mb-1 border border-white/20">
                  <img
                    src={PRESET_CHILD_PORTRAITS.portrait_boy}
                    alt="Boy Portrait"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-[11px] block">Boy Portrait</span>
                <span className="text-[9px] text-slate-400">Boy Explorer</span>
              </button>

              {/* Option 4: Vector Avatar */}
              <button
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  setAvatar({
                    ...avatar,
                    photoType: 'avatar',
                  });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  avatar.photoType === 'avatar' || (!avatar.photoType && !avatar.customPhotoUrl)
                    ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-xl mb-0.5">🧸</span>
                <span className="font-bold text-[11px] block">Vector Avatar</span>
                <span className="text-[9px] text-slate-400">Custom Drawing</span>
              </button>
            </div>
          </div>

          {/* Companion Pet */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Companion Pet
            </label>
            <div className="grid grid-cols-3 gap-2">
              {companions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setAvatar({ ...avatar, companion: c.id });
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    avatar.companion === c.id
                      ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/40'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl block mb-0.5">{c.icon}</span>
                  <span className="text-[11px] font-semibold block truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Outfit Color
            </label>
            <div className="flex items-center gap-3">
              {outfitColors.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setAvatar({ ...avatar, outfitColor: c.color });
                  }}
                  style={{ backgroundColor: c.color }}
                  className={`w-9 h-9 rounded-full transition-transform cursor-pointer border-2 ${
                    avatar.outfitColor === c.color
                      ? 'scale-115 border-white ring-2 ring-amber-400 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Adventure Gear & Hats
            </label>
            <div className="grid grid-cols-3 gap-2">
              {accessories.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setAvatar({ ...avatar, accessory: a.id });
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    avatar.accessory === a.id
                      ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/40'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl block mb-0.5">{a.icon || '—'}</span>
                  <span className="text-[11px] font-semibold block truncate">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hairstyle */}
          {(!avatar.photoType || avatar.photoType === 'avatar') && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Hairstyle (For Vector Avatar)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {hairStyles.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      sound.playTap(profile.preferences.soundEnabled);
                      setAvatar({ ...avatar, hairStyle: h.id });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      avatar.hairStyle === h.id
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save */}
        <div className="pt-3 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Save Explorer Photo & Look! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
