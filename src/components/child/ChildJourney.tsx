import React, { useState } from 'react';
import { YearlyJourneyNode, ChildProfile, PatienceBonusRule } from '../../types';
import { Calendar, Sparkles, TrendingUp, Award, Check, Clock, X } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ChildJourneyProps {
  profile: ChildProfile;
  yearlyJourney: YearlyJourneyNode[];
  patienceRules: PatienceBonusRule[];
  onOpenPatienceSimulator?: () => void;
}

export const ChildJourney: React.FC<ChildJourneyProps> = ({
  profile,
  yearlyJourney,
  patienceRules,
  onOpenPatienceSimulator,
}) => {
  const [selectedYear, setSelectedYear] = useState<YearlyJourneyNode | null>(
    yearlyJourney.find((y) => y.isCurrent) || yearlyJourney[0]
  );
  const [activeTab, setActiveTab] = useState<'timeline' | 'patience'>('timeline');

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto pt-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide flex items-center justify-center gap-2">
          <span>🧭</span> My 10-Year Journey
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Every small step today grows into a legendary decade of personal achievement.
        </p>

        {/* View Toggle Tabs */}
        <div className="mt-4 inline-flex p-1 bg-white/10 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveTab('timeline');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Annual Roadmap (2024–2035)
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveTab('patience');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'patience'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🌱 Patience Bonus Tree
          </button>
        </div>
      </div>

      {activeTab === 'timeline' ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Horizontal scrollable Year Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {yearlyJourney.map((node) => {
              const isSelected = selectedYear?.year === node.year;
              return (
                <button
                  key={node.year}
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    setSelectedYear(node);
                  }}
                  className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-md scale-105'
                      : node.isCurrent
                      ? 'bg-emerald-950/80 border-emerald-400/50 text-white'
                      : node.isUnlocked
                      ? 'bg-slate-900 border-white/15 text-slate-200'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-base">{node.themeIcon}</div>
                  <div className="text-xs font-extrabold mt-0.5">{node.year}</div>
                  <div className="text-[10px] opacity-80">{node.grade}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Year Spotlight Card */}
          {selectedYear && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/15 shadow-xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-4 border-b border-white/10 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                    {selectedYear.themeIcon}
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        {selectedYear.year} · Age {selectedYear.age} · {selectedYear.grade}
                      </span>
                      {selectedYear.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                          Current Year ⭐
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-extrabold text-2xl text-white mt-0.5">
                      {selectedYear.stageName}
                    </h3>
                  </div>
                </div>

                {/* Savings / Points Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
                    <span className="text-[10px] text-amber-300 font-semibold uppercase block">
                      Year Points
                    </span>
                    <span className="text-sm font-extrabold text-amber-300">
                      {selectedYear.pointsEarned ? `⭐ ${selectedYear.pointsEarned}` : 'Planned'}
                    </span>
                  </div>

                  {profile.preferences.showRealMoneyToChild && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-center">
                      <span className="text-[10px] text-emerald-300 font-semibold uppercase block">
                        Saved
                      </span>
                      <span className="text-sm font-extrabold text-emerald-300">
                        {selectedYear.moneySaved
                          ? `🪙 ${profile.currency}${selectedYear.moneySaved.toLocaleString()}`
                          : 'Goal'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Milestones in this year */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Key Milestones Achieved
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedYear.milestonesUnlocked.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Memory Log clues */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Story Memories & Clues
                </h4>
                <div className="space-y-2">
                  {selectedYear.memories.map((mem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{mem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patience Multiplier info */}
              <div className="mt-5 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-between text-xs">
                <span className="text-slate-300">Patience Bonus Growth Factor:</span>
                <span className="font-extrabold text-amber-300">
                  +{Math.round((selectedYear.patienceBonusMultiplier - 1) * 100)}% Boost
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Patience Bonus Tree View */
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-950/50 border border-emerald-500/30 text-center">
            <span className="text-3xl">🌱 ➔ 🌿 ➔ 🌳 ➔ 🌲 ➔ 🏔️ ➔ 🌌</span>
            <h3 className="font-display font-extrabold text-xl text-white mt-2">
              The Power of Patience
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
              When points stay in your adventure piggy bank instead of impulse withdrawals, they
              unlock special patience reward tiers over months and years!
            </p>
            {onOpenPatienceSimulator && (
              <button
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  onOpenPatienceSimulator();
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow cursor-pointer transition-transform hover:scale-103"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Growth Simulator</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {patienceRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start gap-3.5 shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl flex-shrink-0">
                  {rule.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{rule.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold">
                      +{rule.bonusPercentage}% Bonus
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
