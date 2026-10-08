import React, { useState, useRef } from 'react';
import {
  ChildProfile,
  ChildAccount,
  AdventureTheme,
  CompanionType,
  AccessoryType,
} from '../../types';
import { THEMES, WORLD_MILESTONES, DEFAULT_PATIENCE_RULES, INITIAL_ACHIEVEMENTS, PRESET_CHILD_PORTRAITS } from '../../utils/constants';
import { sound } from '../../utils/audio';
import { X, ArrowRight, ArrowLeft, Sparkles, Check, Rocket, Upload, Camera } from 'lucide-react';
import { AvatarRenderer } from '../common/AvatarRenderer';

interface NewJourneyWizardModalProps {
  onComplete: (newChildAccount: ChildAccount) => void;
  onClose: () => void;
}

export const NewJourneyWizardModal: React.FC<NewJourneyWizardModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('2018-06-15');
  const [grade, setGrade] = useState('Class 1');
  const [theme, setTheme] = useState<AdventureTheme>('mountain');
  const [companion, setCompanion] = useState<CompanionType>('dragon');
  const [photoType, setPhotoType] = useState<'custom' | 'portrait_girl' | 'portrait_boy' | 'avatar'>('portrait_girl');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(PRESET_CHILD_PORTRAITS.portrait_girl);
  const [currency, setCurrency] = useState('₹');
  const [startingPoints, setStartingPoints] = useState('0');
  const [startingMoney, setStartingMoney] = useState('500');
  const [parentPin, setParentPin] = useState('1234');

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
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotoType('custom');
        setCustomPhotoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinish = () => {
    sound.playLevelUp(true);

    const initPoints = parseInt(startingPoints, 10) || 0;
    const initMoney = parseFloat(startingMoney) || 0;

    const newProfile: ChildProfile = {
      id: `child_${Date.now()}`,
      name: name.trim() || 'Young Adventurer',
      nickname: nickname.trim() || name.trim() || 'Explorer',
      birthDate,
      currentAge: 7,
      schoolGrade: grade,
      ageGroup: 'junior',
      theme,
      currency,
      avatar: {
        gender: 'neutral',
        skinTone: '#FCD34D',
        hairStyle: 'spiky',
        hairColor: '#451A03',
        outfitColor: '#0284C7',
        companion,
        accessory: 'explorer_hat',
        photoType,
        customPhotoUrl: photoType !== 'avatar' ? customPhotoUrl : undefined,
      },
      preferences: {
        soundEnabled: true,
        musicEnabled: false,
        animationsEnabled: true,
        showRealMoneyToChild: true,
        allowChildRedeemRequest: true,
        streakEnabled: true,
        allowNegativePoints: false,
      },
      stats: {
        currentPoints: initPoints,
        currentBalance: initMoney,
        currentStreak: 1,
        bestStreak: 1,
        level: Math.max(1, Math.floor(initPoints / 150) + 1),
        totalLifetimePoints: initPoints,
        totalSavedMoney: initMoney,
        lastActivityDate: new Date().toISOString(),
        bestMonthPoints: initPoints,
        currentMonthPoints: initPoints,
        previousMonthPoints: 0,
      },
    };

    const initialTx = [];
    if (initMoney > 0) {
      initialTx.push({
        id: `tx_${Date.now()}_money`,
        timestamp: new Date().toISOString(),
        type: 'money' as const,
        direction: 'add' as const,
        amount: initMoney,
        previousBalance: 0,
        newBalance: initMoney,
        category: 'Starting Balance',
        reason: 'Initial savings deposit to open adventure piggy bank',
        memoryNote: `Opened personal 10-year savings adventure!`,
        performedBy: 'parent' as const,
      });
    }

    const currentYear = new Date().getFullYear();
    const yearlyJourney = Array.from({ length: 12 }, (_, i) => {
      const yr = currentYear + i;
      const icons = ['🌱', '🌿', '🌳', '🌲', '🏕️', '🏔️', '🏰', '🚀', '🌙', '🌌', '🪐', '⭐'];
      return {
        year: yr,
        age: 7 + i,
        grade: `Class ${1 + i}`,
        stageName: `Year ${i + 1} Odyssey`,
        themeIcon: icons[i % icons.length],
        pointsEarned: i === 0 ? initPoints : 0,
        moneySaved: i === 0 ? initMoney : 0,
        patienceBonusMultiplier: 1 + i * 0.1,
        milestonesUnlocked: i === 0 ? ['Starting Village'] : [],
        memories: i === 0 ? ['Embarked on the 10-year personal growth adventure!'] : [],
        isUnlocked: i === 0,
        isCurrent: i === 0,
      };
    });

    const newChildAccount: ChildAccount = {
      profile: newProfile,
      transactions: initialTx,
      rewards: [
        {
          id: `rew_${Date.now()}_1`,
          title: 'Illustrated Storybook',
          description: 'A magical bedtime adventure book.',
          pointsCost: 300,
          icon: '📚',
          category: 'Books',
          status: 'available',
          requiresParentApproval: true,
        },
        {
          id: `rew_${Date.now()}_2`,
          title: 'Ice Cream Parlor Celebration',
          description: 'A visit to get your favorite triple scoop cone!',
          pointsCost: 500,
          icon: '🍦',
          category: 'Treats',
          status: 'available',
          requiresParentApproval: true,
        },
      ],
      achievements: INITIAL_ACHIEVEMENTS,
      yearlyJourney,
    };

    onComplete(newChildAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white">
              Launch New 10-Year Adventure
            </h3>
            <p className="text-xs text-slate-300">Step {step} of 4: Setup Wizard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Body */}
        <div className="overflow-y-auto space-y-4 py-4 flex-1 text-xs">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">1. Child Identity</h4>
              <div>
                <label className="text-slate-400 block mb-1">Child's Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nickname (Used in app)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Aarav"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Current Class / Grade</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. Class 1"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">2. Adventure World & Companion</h4>
              <div>
                <label className="text-slate-400 block mb-1.5">Choose Starting Adventure Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as AdventureTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                        theme === t
                          ? 'bg-amber-400/20 border-amber-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-xl">{THEMES[t].icon}</span>
                      <span className="font-bold text-xs truncate">{THEMES[t].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5">Choose Loyal Pet Companion</label>
                <div className="grid grid-cols-3 gap-2">
                  {companions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCompanion(c.id)}
                      className={`p-2 rounded-xl border text-center cursor-pointer ${
                        companion === c.id
                          ? 'bg-amber-400/20 border-amber-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-2xl block mb-0.5">{c.icon}</span>
                      <span className="text-[10px] block font-semibold truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo & Portrait Selection */}
              <div className="pt-2 border-t border-white/10">
                <label className="text-slate-400 block mb-1.5 font-bold">Child Profile Photo / Portrait</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoType('portrait_girl');
                      setCustomPhotoUrl(PRESET_CHILD_PORTRAITS.portrait_girl);
                    }}
                    className={`p-2 rounded-xl border text-center cursor-pointer ${
                      photoType === 'portrait_girl'
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto overflow-hidden mb-1">
                      <img src={PRESET_CHILD_PORTRAITS.portrait_girl} alt="Girl" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-bold block truncate">Girl Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhotoType('portrait_boy');
                      setCustomPhotoUrl(PRESET_CHILD_PORTRAITS.portrait_boy);
                    }}
                    className={`p-2 rounded-xl border text-center cursor-pointer ${
                      photoType === 'portrait_boy'
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto overflow-hidden mb-1">
                      <img src={PRESET_CHILD_PORTRAITS.portrait_boy} alt="Boy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-bold block truncate">Boy Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-xl border text-center cursor-pointer ${
                      photoType === 'custom'
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <Upload className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <span className="text-[10px] font-bold block truncate">Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">3. Starting Points & Money</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Starting Points (⭐)</label>
                  <input
                    type="number"
                    min="0"
                    value={startingPoints}
                    onChange={(e) => setStartingPoints(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-base"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Currency Symbol</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-base"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Initial Real Money Savings Deposit</label>
                <input
                  type="number"
                  min="0"
                  value={startingMoney}
                  onChange={(e) => setStartingMoney(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-base"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Parent 4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={parentPin}
                  onChange={(e) => setParentPin(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-center tracking-widest text-base"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl animate-bounce">
                🚀
              </div>
              <h4 className="font-display font-extrabold text-xl text-white">
                Everything is Ready!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                <strong>{name || 'Explorer'}</strong>'s 10-year adventure journal is prepared with{' '}
                {startingPoints} ⭐ points, {currency}{startingMoney} savings, and companion{' '}
                {companions.find((c) => c.id === companion)?.label}.
              </p>
            </div>
          )}
        </div>

        {/* Wizard Footer Nav */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  alert('Please enter child name');
                  return;
                }
                setStep((s) => s + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <span>Next</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
            >
              <Rocket className="w-4 h-4" /> Launch 10-Year Adventure!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
