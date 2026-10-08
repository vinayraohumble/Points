import React, { useState } from 'react';
import {
  ChildProfile,
  ChildAccount,
  Transaction,
  Reward,
  PatienceBonusRule,
  TransactionDirection,
} from '../../types';
import { AvatarRenderer } from '../common/AvatarRenderer';
import { AddMoneyModal } from './AddMoneyModal';
import { AddPointsModal } from './AddPointsModal';
import { ManageRewardsModal } from './ManageRewardsModal';
import { ParentLedger } from './ParentLedger';
import { ParentSettingsModal } from './ParentSettingsModal';
import {
  Shield,
  Wallet,
  Star,
  Gift,
  FileText,
  Sliders,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Terminal,
  LogOut,
  Users,
  UserPlus,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentDashboardProps {
  childrenAccounts: ChildAccount[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  profile: ChildProfile;
  transactions: Transaction[];
  rewards: Reward[];
  patienceRules: PatienceBonusRule[];
  storedPin: string;
  onExitParentMode: () => void;
  onOpenAdminPortal: () => void;
  onOpenCertificate: () => void;
  onOpenNewJourneyWizard: () => void;
  onAddMoneyTx: (
    direction: TransactionDirection,
    amount: number,
    category: string,
    reason: string,
    memoryNote?: string
  ) => void;
  onAddPointsTx: (
    direction: TransactionDirection,
    amount: number,
    category: string,
    reason: string,
    memoryNote?: string
  ) => void;
  onApproveRedeem: (rewardId: string) => void;
  onDeclineRedeem: (rewardId: string) => void;
  onAddReward: (reward: Omit<Reward, 'id' | 'status'>) => void;
  onDeleteReward: (rewardId: string) => void;
  onAddCorrection: (
    type: 'points' | 'money',
    amount: number,
    direction: 'add' | 'remove',
    reason: string
  ) => void;
  onUpdateProfile: (profile: ChildProfile) => void;
  onUpdatePin: (newPin: string) => void;
  onUpdatePatienceRules: (rules: PatienceBonusRule[]) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childrenAccounts,
  activeChildId,
  onSelectChild,
  profile,
  transactions,
  rewards,
  patienceRules,
  storedPin,
  onExitParentMode,
  onOpenAdminPortal,
  onOpenCertificate,
  onOpenNewJourneyWizard,
  onAddMoneyTx,
  onAddPointsTx,
  onApproveRedeem,
  onDeclineRedeem,
  onAddReward,
  onDeleteReward,
  onAddCorrection,
  onUpdateProfile,
  onUpdatePin,
  onUpdatePatienceRules,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'rewards' | 'settings'>('overview');
  const [activeModal, setActiveModal] = useState<
    'none' | 'add_money' | 'add_points' | 'manage_rewards' | 'settings'
  >('none');

  const pendingRequests = rewards.filter((r) => r.status === 'requested');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col animate-fade-in">
      {/* Top Bar for Parent Mode */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                onExitParentMode();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Return to Child Adventure Screen"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Child Adventure</span>
            </button>

            <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="font-display font-extrabold text-white text-sm sm:text-base">
                Parent Ledger Command
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                onOpenAdminPortal();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Secure Developer & System Admin Portal"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">System Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap(profile.preferences.soundEnabled);
                onExitParentMode();
              }}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
              title="Exit Parent Mode"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Child Financial Summary Banner with Profile Switcher */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full md:w-auto">
            <div className="relative flex-shrink-0">
              <AvatarRenderer avatar={profile.avatar} size="lg" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Child Switcher Dropdown */}
                <select
                  value={activeChildId}
                  onChange={(e) => {
                    sound.playTap(profile.preferences.soundEnabled);
                    onSelectChild(e.target.value);
                  }}
                  className="bg-slate-950 border border-amber-400/40 text-white font-display font-extrabold text-base sm:text-lg rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  title="Switch Child Profile"
                >
                  {childrenAccounts.map((acc) => (
                    <option key={acc.profile.id} value={acc.profile.id}>
                      {acc.profile.name} ({acc.profile.schoolGrade})
                    </option>
                  ))}
                </select>

                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  Level {profile.stats.level} Explorer
                </span>

                <button
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    onOpenNewJourneyWizard();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-white/10 cursor-pointer"
                  title="Add Another Child Profile"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">+ Add Child</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Age {profile.currentAge} · {profile.schoolGrade} · {profile.stats.currentStreak} Day Streak 🔥
              </p>
            </div>
          </div>

          {/* Quick Ledger Totals */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Audited Real Balance
              </span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-white tabular-nums">
                {profile.currency}{profile.stats.currentBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Total Adventure Stars
              </span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-white tabular-nums">
                ⭐ {profile.stats.currentPoints.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveModal('add_money');
            }}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-bold text-sm shadow-lg flex flex-col items-center justify-center text-center transition-all hover:scale-102 cursor-pointer"
          >
            <Wallet className="w-6 h-6 mb-1 text-slate-950" />
            <span>➕ Add Money</span>
            <span className="text-[10px] font-semibold opacity-80 mt-0.5">Bank Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveModal('add_money');
            }}
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 font-display font-bold text-sm shadow-md flex flex-col items-center justify-center text-center transition-all hover:scale-102 cursor-pointer"
          >
            <Wallet className="w-6 h-6 mb-1 text-rose-400" />
            <span>➖ Remove Money</span>
            <span className="text-[10px] font-normal text-slate-400 mt-0.5">Withdrawal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveModal('add_points');
            }}
            className="p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm shadow-lg flex flex-col items-center justify-center text-center transition-all hover:scale-102 cursor-pointer"
          >
            <Star className="w-6 h-6 mb-1 fill-slate-950" />
            <span>⭐ Award Points</span>
            <span className="text-[10px] font-semibold opacity-80 mt-0.5">Reading / Habits</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap(profile.preferences.soundEnabled);
              setActiveModal('manage_rewards');
            }}
            className="p-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-display font-bold text-sm shadow-lg flex flex-col items-center justify-center text-center transition-all hover:scale-102 cursor-pointer"
          >
            <Gift className="w-6 h-6 mb-1" />
            <span>🎁 Manage Rewards</span>
            <span className="text-[10px] font-semibold opacity-80 mt-0.5">
              {pendingRequests.length > 0 ? `${pendingRequests.length} Pending!` : 'Chest Goals'}
            </span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: FileText },
            { id: 'ledger', label: `Detailed Ledger (${transactions.length})`, icon: Wallet },
            { id: 'rewards', label: `Rewards & Approvals (${rewards.length})`, icon: Gift },
            { id: 'settings', label: 'Rules & Profile Settings', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playTap(profile.preferences.soundEnabled);
                  setActiveTab(tab.id as any);
                }}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Pending Approvals Callout if any */}
            {pendingRequests.length > 0 && (
              <div className="p-4 rounded-3xl bg-amber-950/40 border border-amber-400/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {pendingRequests.length} Reward Claim Pending Approval!
                    </h4>
                    <p className="text-xs text-amber-200 mt-0.5">
                      {pendingRequests[0].title} ({pendingRequests[0].pointsCost} ⭐)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDeclineRedeem(pendingRequests[0].id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveRedeem(pendingRequests[0].id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}

            {/* Quick Recent Activity Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-white">
                  Recent Ledger Activity
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                >
                  View Full Audit Ledger →
                </button>
              </div>

              <div className="space-y-2.5">
                {transactions.slice(-4).reverse().map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{tx.type === 'points' ? '⭐' : '🪙'}</span>
                      <div>
                        <span className="font-bold text-white block">{tx.category}</span>
                        <span className="text-slate-400">{tx.reason}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          tx.direction === 'add' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.direction === 'add' ? '+' : '−'}
                        {tx.type === 'points' ? `${tx.amount} ⭐` : `${profile.currency}${tx.amount}`}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        New: {tx.type === 'points' ? `${tx.newBalance} ⭐` : `${profile.currency}${tx.newBalance.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patience Rules Quick Summary */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-white">
                  Active Patience Bonus Rules
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  Compounding Consistency
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {patienceRules.slice(0, 6).map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center gap-2.5"
                  >
                    <span className="text-2xl">{rule.icon}</span>
                    <div>
                      <span className="text-[11px] font-bold text-white block">{rule.label}</span>
                      <span className="text-[10px] text-amber-400 font-extrabold">
                        +{rule.bonusPercentage}% Bonus
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Honors & Setup Tools */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Milestone Honors & Family Tools
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate print-ready certificates or configure a new child's journey
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    onOpenCertificate();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🎓 Print Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playTap(profile.preferences.soundEnabled);
                    onOpenNewJourneyWizard();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🚀 New Child Wizard</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <ParentLedger
            profile={profile}
            transactions={transactions}
            onAddCorrection={onAddCorrection}
          />
        )}

        {activeTab === 'rewards' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-white">
                Rewards Catalog & Claims
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal('manage_rewards')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                + Add or Edit Rewards
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rewards.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{r.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{r.title}</h4>
                      <p className="text-xs text-amber-300 font-semibold">{r.pointsCost} ⭐</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Parent Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Update PIN, child grade, currency, and privacy rules
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('settings')}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Open Full Settings Editor
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-xs text-slate-300 space-y-2">
              <p>• Child: <strong>{profile.name} ({profile.schoolGrade})</strong></p>
              <p>• Currency: <strong>{profile.currency}</strong></p>
              <p>• Real Money Visible to Child: <strong>{profile.preferences.showRealMoneyToChild ? 'Yes' : 'No'}</strong></p>
              <p>• Child Redemption Requests: <strong>{profile.preferences.allowChildRedeemRequest ? 'Enabled' : 'Disabled'}</strong></p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal === 'add_money' && (
        <AddMoneyModal
          profile={profile}
          onConfirm={onAddMoneyTx}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'add_points' && (
        <AddPointsModal
          profile={profile}
          onConfirm={onAddPointsTx}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'manage_rewards' && (
        <ManageRewardsModal
          profile={profile}
          rewards={rewards}
          onApproveRedeem={onApproveRedeem}
          onDeclineRedeem={onDeclineRedeem}
          onAddReward={onAddReward}
          onDeleteReward={onDeleteReward}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'settings' && (
        <ParentSettingsModal
          profile={profile}
          storedPin={storedPin}
          patienceRules={patienceRules}
          onUpdateProfile={onUpdateProfile}
          onUpdatePin={onUpdatePin}
          onUpdatePatienceRules={onUpdatePatienceRules}
          onClose={() => setActiveModal('none')}
        />
      )}
    </div>
  );
};
