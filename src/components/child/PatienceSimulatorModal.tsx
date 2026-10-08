import React, { useState } from 'react';
import { ChildProfile, PatienceBonusRule } from '../../types';
import { X, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PatienceSimulatorModalProps {
  profile: ChildProfile;
  patienceRules: PatienceBonusRule[];
  onClose: () => void;
}

export const PatienceSimulatorModal: React.FC<PatienceSimulatorModalProps> = ({
  profile,
  patienceRules,
  onClose,
}) => {
  const [selectedRuleIdx, setSelectedRuleIdx] = useState(2); // 1 Year default
  const [basePoints, setBasePoints] = useState(1000);
  const [calcMode, setCalcMode] = useState<'points' | 'money'>('points');

  const rule = patienceRules[selectedRuleIdx] || patienceRules[0];
  const bonusAmount = Math.round((basePoints * rule.bonusPercentage) / 100);
  const totalYield = basePoints + bonusAmount;

  const treeStages = [
    { icon: '🌱', label: 'Tiny Sprout (1 Mo)' },
    { icon: '🌿', label: 'Fresh Branch (6 Mo)' },
    { icon: '🌳', label: 'Mighty Oak (1 Yr)' },
    { icon: '🌲', label: 'Ancient Redwood (3 Yrs)' },
    { icon: '🏔️', label: 'Summit Pine (5 Yrs)' },
    { icon: '🌌', label: 'Galaxy Celestial Tree (10 Yrs)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl text-emerald-300">
              🌱
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Patience Growth Simulator
              </h3>
              <p className="text-xs text-slate-300">
                See how discipline compounds your points & savings over time
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

        {/* Big Visual Growth Showcase */}
        <div className="my-4 p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 text-center">
          <div className="text-6xl mb-2 animate-bounce">{rule.icon}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            {rule.label} Stage
          </div>
          <h4 className="font-display font-extrabold text-2xl text-white mt-1">
            +{rule.bonusPercentage}% Patience Bonus
          </h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
            {rule.description}
          </p>
        </div>

        {/* Base Input Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Base Points Saved
            </label>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              {[500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setBasePoints(val);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    basePoints === val
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {val} ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Time Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Time Saved Without Breaking Bank:</span>
              <span className="text-amber-300">{rule.label}</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {patienceRules.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setSelectedRuleIdx(idx);
                  }}
                  className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRuleIdx === idx
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md scale-105'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base block">{r.icon}</span>
                  <span className="text-[10px] block mt-0.5">{r.months >= 12 ? `${r.months / 12}Y` : `${r.months}M`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Breakdown Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Original Points Saved:</span>
              <span className="font-bold font-mono">{basePoints.toLocaleString()} ⭐</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Patience Bonus (+{rule.bonusPercentage}%):</span>
              <span className="font-mono">+{bonusAmount.toLocaleString()} ⭐</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-white font-extrabold text-sm">
              <span>Total Reward Power:</span>
              <span className="text-amber-300 font-mono text-base">{totalYield.toLocaleString()} ⭐</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
        >
          I Understand the Power of Patience! 🌟
        </button>
      </div>
    </div>
  );
};
