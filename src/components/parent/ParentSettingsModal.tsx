import React, { useState, useRef } from 'react';
import { ChildProfile, AgeGroup, PatienceBonusRule, ChildAvatar } from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { X, Save, Lock, User, Eye, Shield, Sliders, Camera, Upload, Trash2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentSettingsModalProps {
  profile: ChildProfile;
  storedPin: string;
  patienceRules: PatienceBonusRule[];
  onUpdateProfile: (updated: ChildProfile) => void;
  onUpdatePin: (newPin: string) => void;
  onUpdatePatienceRules: (rules: PatienceBonusRule[]) => void;
  onClose: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  profile,
  storedPin,
  patienceRules,
  onUpdateProfile,
  onUpdatePin,
  onUpdatePatienceRules,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [schoolGrade, setSchoolGrade] = useState(profile.schoolGrade);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup);
  const [currency, setCurrency] = useState(profile.currency);
  const [avatar, setAvatar] = useState<ChildAvatar>({ ...profile.avatar });
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [showRealMoney, setShowRealMoney] = useState(profile.preferences.showRealMoneyToChild);
  const [allowRedeem, setAllowRedeem] = useState(profile.preferences.allowChildRedeemRequest);
  const [allowNegative, setAllowNegative] = useState(profile.preferences.allowNegativePoints);
  const [streakEnabled, setStreakEnabled] = useState(profile.preferences.streakEnabled);

  // PIN settings
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatar((prev) => ({
          ...prev,
          photoType: 'custom',
          customPhotoUrl: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playStarSparkle(profile.preferences.soundEnabled);
    onUpdateProfile({
      ...profile,
      name,
      nickname,
      schoolGrade,
      ageGroup,
      currency,
      avatar,
      preferences: {
        ...profile.preferences,
        showRealMoneyToChild: showRealMoney,
        allowChildRedeemRequest: allowRedeem,
        allowNegativePoints: allowNegative,
        streakEnabled,
      },
    });
    onClose();
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== storedPin) {
      setPinMessage({ text: 'Current PIN is incorrect.', error: true });
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinMessage({ text: 'New PIN must be exactly 4 digits.', error: true });
      return;
    }
    onUpdatePin(newPinInput);
    setPinMessage({ text: 'Parent PIN successfully updated! 🎉', error: false });
    setCurrentPinInput('');
    setNewPinInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Parent & Child Configuration
              </h3>
              <p className="text-xs text-slate-300">
                10-year growth parameters and security rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Form */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1 py-3">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Child Profile Information */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Child Information & Photo
              </h4>

              {/* Photo Preview & Upload Control */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-white/5">
                <AvatarRenderer avatar={avatar} size="lg" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block">Child Profile Picture</span>
                  <span className="text-[11px] text-slate-400 block mb-2">
                    {avatar.photoType === 'custom'
                      ? 'Custom Uploaded Photo'
                      : avatar.photoType === 'portrait_girl' || avatar.photoType === 'portrait_boy'
                      ? 'AI Adventure Portrait'
                      : 'Vector Animated Character'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-300"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Real Photo</span>
                    </button>
                    {avatar.customPhotoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setAvatar((prev) => ({
                            ...prev,
                            photoType: 'avatar',
                            customPhotoUrl: undefined,
                          }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-rose-300 hover:text-rose-200 text-xs font-semibold cursor-pointer"
                      >
                        Reset to Avatar
                      </button>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nickname</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={schoolGrade}
                    onChange={(e) => setSchoolGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Age Adaptation</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="junior">Junior (Ages 6–8)</option>
                    <option value="pathfinder">Pathfinder (Ages 9–12)</option>
                    <option value="master">Master (Ages 13–16+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Currency Symbol</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="₹">₹ (INR Rupee)</option>
                    <option value="$">$ (USD Dollar)</option>
                    <option value="€">€ (EUR Euro)</option>
                    <option value="£">£ (GBP Pound)</option>
                    <option value="¥">¥ (JPY Yen)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Child Visibility & Safety Toggles */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Child Privacy & Visibility
              </h4>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Show Real Money Balance to Child
                    </span>
                    <span className="text-[11px] text-slate-400">
                      When off, child only sees adventure points (⭐). Real savings stay in parent mode.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRealMoney}
                    onChange={(e) => setShowRealMoney(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Allow Child to Request Reward Claims
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Child can tap "Request Reward" when points match, awaiting parent approval.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRedeem}
                    onChange={(e) => setAllowRedeem(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Allow Negative Point Deductions
                    </span>
                    <span className="text-[11px] text-slate-400">
                      We recommend positive reinforcement only. Toggle on if penalty deductions needed.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowNegative}
                    onChange={(e) => setAllowNegative(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Show Daily Consistency Flame Streak
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Encourages day-by-day active participation and habits.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={streakEnabled}
                    onChange={(e) => setStreakEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile & Visibility Settings
            </button>
          </form>

          {/* Change PIN Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Change Parent PIN
            </h4>

            {pinMessage && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold ${
                  pinMessage.error
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {pinMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdatePin} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Current PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="e.g. 5678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Update PIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
