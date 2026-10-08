import React, { useState } from 'react';
import { ChildProfile, TransactionDirection } from '../../types';
import { X, Star, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AddPointsModalProps {
  profile: ChildProfile;
  onConfirm: (
    direction: TransactionDirection,
    amount: number,
    category: string,
    reason: string,
    memoryNote?: string
  ) => void;
  onClose: () => void;
}

export const AddPointsModal: React.FC<AddPointsModalProps> = ({ profile, onConfirm, onClose }) => {
  const [direction, setDirection] = useState<TransactionDirection>('add');
  const [amount, setAmount] = useState<string>('50');
  const [category, setCategory] = useState('Reading');
  const [reason, setReason] = useState('Completed chapter reading');
  const [memoryNote, setMemoryNote] = useState('');

  const numAmount = parseInt(amount, 10) || 0;
  const currentPoints = profile.stats.currentPoints;
  const newPoints = direction === 'add' ? currentPoints + numAmount : Math.max(0, currentPoints - numAmount);

  // Quick activity presets
  const presets = [
    { label: '📚 Reading Challenge', cat: 'Reading', pts: 30, desc: 'Finished 3 book chapters' },
    { label: '🧠 Math & Homework', cat: 'Learning', pts: 25, desc: 'Completed school assignments' },
    { label: '🏃 Exercise & Sports', cat: 'Sports', pts: 25, desc: 'Swimming / park playtime' },
    { label: '🧹 Helping at Home', cat: 'Responsibility', pts: 20, desc: 'Cleaned desk and room' },
    { label: '🌱 Good Habit', cat: 'Good Habit', pts: 15, desc: 'Packed backpack before bed' },
    { label: '🌟 Special Kindness', cat: 'Kindness', pts: 50, desc: 'Helped family member with love' },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    sound.playTap(profile.preferences.soundEnabled);
    setCategory(p.cat);
    setAmount(p.pts.toString());
    setReason(p.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    sound.playStarSparkle(profile.preferences.soundEnabled);
    onConfirm(direction, numAmount, category, reason, memoryNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl text-amber-300">
              <Star className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Award Adventure Points
              </h3>
              <p className="text-xs text-slate-300">
                Encourage positive habits & milestones for {profile.name}
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Direction Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                setDirection('add');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'add'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ⭐ Add Points
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                setDirection('remove');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'remove'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ✏️ Adjust / Deduct Points
            </button>
          </div>

          {/* Quick Presets Carousel */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Activity Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold text-white block truncate">{p.label}</span>
                  <span className="text-[11px] font-extrabold text-amber-300 mt-0.5 block">
                    +{p.pts} ⭐
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Points Amount Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Points Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-xl text-amber-300">
                ⭐
              </span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-display font-bold text-2xl focus:outline-none focus:border-amber-400"
                placeholder="50"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Activity Reason
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Read for 30 minutes before sleep"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Memory Note */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Memory Note <span className="text-[10px] text-slate-400 font-normal">(Preserved for years in journal)</span>
            </label>
            <textarea
              value={memoryNote}
              onChange={(e) => setMemoryNote(e.target.value)}
              placeholder="e.g. Read Charlotte’s Web chapter with enthusiasm!"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Points Live Preview */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Current Total</span>
              <span className="font-bold text-slate-200">{currentPoints} ⭐</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-slate-400 block">New Adventure Total</span>
              <span className="font-bold text-amber-300">{newPoints} ⭐</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={numAmount <= 0}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            Award {numAmount} Points Now! ⭐
          </button>
        </form>
      </div>
    </div>
  );
};
