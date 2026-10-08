import React, { useState } from 'react';
import { ChildProfile, TransactionDirection } from '../../types';
import { X, Check, AlertTriangle, ArrowRight, Wallet } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AddMoneyModalProps {
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

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ profile, onConfirm, onClose }) => {
  const [direction, setDirection] = useState<TransactionDirection>('add');
  const [amount, setAmount] = useState<string>('500');
  const [category, setCategory] = useState('Birthday Gift');
  const [reason, setReason] = useState('Birthday savings deposit');
  const [memoryNote, setMemoryNote] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const currentBal = profile.stats.currentBalance;
  const newBal = direction === 'add' ? currentBal + numAmount : currentBal - numAmount;

  const presets = [100, 200, 500, 1000, 2000, 5000];

  const categories = [
    { label: '🎂 Birthday Gift', val: 'Birthday Gift' },
    { label: '🎁 Family Gift', val: 'Family Gift' },
    { label: '💰 Regular Allowance', val: 'Regular Allowance' },
    { label: '🏆 Academic / Exam Reward', val: 'Exam Reward' },
    { label: '🧹 Extra Responsibility', val: 'Responsibility Reward' },
    { label: '🛍️ Goal Redemption Withdrawal', val: 'Redemption Withdrawal' },
    { label: '✏️ Other Purpose', val: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    if (direction === 'remove' && numAmount > currentBal) {
      alert("Cannot remove more than child's current balance!");
      return;
    }
    setIsConfirming(true);
  };

  const handleFinalConfirm = () => {
    sound.playCoinClink(profile.preferences.soundEnabled);
    onConfirm(direction, numAmount, category, reason, memoryNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl text-emerald-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Manage Real Money Balance
              </h3>
              <p className="text-xs text-slate-300">
                Audited ledger entry for {profile.name}
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

        {!isConfirming ? (
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
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ➕ Add Money
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
                ➖ Remove / Redeem Money
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Amount ({profile.currency})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-xl text-slate-400">
                  {profile.currency}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-display font-bold text-2xl focus:outline-none focus:border-emerald-400"
                  placeholder="0"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      sound.playTap(profile.preferences.soundEnabled);
                      setAmount(val.toString());
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    +{profile.currency}{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
              >
                {categories.map((c) => (
                  <option key={c.val} value={c.val}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Reason / Memo
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Birthday gift from Grandma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Heart-warming Memory Note */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Memory Note <span className="text-[10px] text-slate-400 font-normal">(Visible in child story journal)</span>
              </label>
              <textarea
                value={memoryNote}
                onChange={(e) => setMemoryNote(e.target.value)}
                placeholder="e.g. Grandma hugged you tight and gave a crisp green ₹500 note for your savings!"
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            {/* Live Balance Preview */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Current Balance</span>
                <span className="font-bold text-slate-200">
                  {profile.currency}{currentBal.toLocaleString()}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <div className="text-right">
                <span className="text-slate-400 block">New Balance</span>
                <span className="font-bold text-emerald-300">
                  {profile.currency}{newBal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={numAmount <= 0}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              Review & Confirm Transaction
            </button>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="mt-4 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-2xl">
              ⚠️
            </div>

            <h4 className="font-display font-extrabold text-lg text-white">
              Confirm Transaction
            </h4>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Action:</span>
                <span className="font-bold text-white capitalize">{direction} Real Money</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-extrabold text-emerald-300">
                  {profile.currency}{numAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Balance:</span>
                <span className="font-extrabold text-white">
                  {profile.currency}{newBal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-200">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reason:</span>
                <span className="text-slate-200">{reason}</span>
              </div>
              {memoryNote && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-slate-400 block">Memory Clue:</span>
                  <span className="italic text-amber-200">“{memoryNote}”</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Confirm & Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
