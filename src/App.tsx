/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppState,
  ChildAccount,
  AdventureTheme,
  TransactionDirection,
  ChildAvatar,
  ChildProfile,
  PatienceBonusRule,
  Reward,
  Transaction,
} from './types';
import { loadAppState, saveAppState, getInitialSeedData } from './utils/storage';
import { THEMES } from './utils/constants';
import { sound } from './utils/audio';

// Common Components
import { ConfettiOverlay } from './components/common/ConfettiOverlay';
import { ThemeSelector } from './components/common/ThemeSelector';

// Child Components
import { ChildHeader } from './components/child/ChildHeader';
import { ChildHome } from './components/child/ChildHome';
import { ChildWorldMap } from './components/child/ChildWorldMap';
import { ChildBaseRoom } from './components/child/ChildBaseRoom';
import { ChildJourney } from './components/child/ChildJourney';
import { ChildRewards } from './components/child/ChildRewards';
import { ChildStoryLog } from './components/child/ChildStoryLog';
import { ChildTrophyRoom } from './components/child/ChildTrophyRoom';
import { ChildAvatarCustomizer } from './components/child/ChildAvatarCustomizer';
import { ChildMyBestModal } from './components/child/ChildMyBestModal';
import { PatienceSimulatorModal } from './components/child/PatienceSimulatorModal';
import { ProfilePickerModal } from './components/child/ProfilePickerModal';

// Parent & Admin Components
import { ParentPinModal } from './components/parent/ParentPinModal';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { CertificateModal } from './components/parent/CertificateModal';
import { NewJourneyWizardModal } from './components/parent/NewJourneyWizardModal';
import { AdminPortal } from './components/admin/AdminPortal';

// Icons
import {
  Home,
  Compass,
  Map,
  Gift,
  BookOpen,
  Sparkles,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [currentRole, setCurrentRole] = useState<'child' | 'parent'>('child');
  const [childTab, setChildTab] = useState<'home' | 'map' | 'base' | 'journey' | 'rewards' | 'history'>('home');

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showMyBestModal, setShowMyBestModal] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showNewJourneyModal, setShowNewJourneyModal] = useState(false);
  const [showPatienceSimModal, setShowPatienceSimModal] = useState(false);
  const [showProfilePickerModal, setShowProfilePickerModal] = useState(false);

  // Confetti
  const [confettiActive, setConfettiActive] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Active Child derivation
  const activeAccount: ChildAccount =
    appState.children.find((c) => c.profile.id === appState.activeChildId) ||
    appState.children[0] ||
    getInitialSeedData().children[0];

  const profile = activeAccount.profile;
  const transactions = activeAccount.transactions;
  const rewards = activeAccount.rewards;
  const achievements = activeAccount.achievements;
  const yearlyJourney = activeAccount.yearlyJourney;

  const currentTheme = THEMES[profile.theme] || THEMES.mountain;

  // Helper to update the currently active child's account
  const updateActiveChild = (updater: (prevAccount: ChildAccount) => ChildAccount) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === activeAccount.profile.id ? updater(child) : child
      ),
    }));
  };

  // Audio toggles
  const handleToggleSound = () => {
    const updated = !profile.preferences.soundEnabled;
    updateActiveChild((acc) => ({
      ...acc,
      profile: {
        ...acc.profile,
        preferences: {
          ...acc.profile.preferences,
          soundEnabled: updated,
        },
      },
    }));
    sound.playTap(updated);
  };

  const handleToggleMusic = () => {
    const updated = !profile.preferences.musicEnabled;
    updateActiveChild((acc) => ({
      ...acc,
      profile: {
        ...acc.profile,
        preferences: {
          ...acc.profile.preferences,
          musicEnabled: updated,
        },
      },
    }));
    sound.toggleAmbientMusic(updated);
  };

  // Switch Theme
  const handleSelectTheme = (themeKey: AdventureTheme) => {
    updateActiveChild((acc) => ({
      ...acc,
      profile: {
        ...acc.profile,
        theme: themeKey,
      },
    }));
    setShowThemeModal(false);
  };

  // Update Avatar
  const handleUpdateAvatar = (newAvatar: ChildAvatar) => {
    updateActiveChild((acc) => ({
      ...acc,
      profile: {
        ...acc.profile,
        avatar: newAvatar,
      },
    }));
  };

  // Switch Child Profile
  const handleSelectChild = (childId: string) => {
    setAppState((prev) => ({
      ...prev,
      activeChildId: childId,
    }));
  };

  // Add New Child Profile
  const handleAddNewChild = (newChild: ChildAccount) => {
    setAppState((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
      activeChildId: newChild.profile.id,
      auditLogs: [
        ...prev.auditLogs,
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'parent',
          action: 'NEW_CHILD_ADDED',
          details: `Created new 10-year growth profile for ${newChild.profile.name} (${newChild.profile.schoolGrade})`,
        },
      ],
    }));
    setShowNewJourneyModal(false);
    setConfettiActive(true);
  };

  // Update Child Profile Details (e.g. from parent settings)
  const handleUpdateProfile = (updated: ChildProfile) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === updated.id
          ? { ...child, profile: updated }
          : child
      ),
    }));
  };

  // Add Money Transaction
  const handleAddMoneyTx = (
    direction: TransactionDirection,
    amount: number,
    category: string,
    reason: string,
    memoryNote?: string
  ) => {
    const currentBal = profile.stats.currentBalance;
    const newBal = direction === 'add' ? currentBal + amount : currentBal - amount;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'money',
      direction,
      amount,
      previousBalance: currentBal,
      newBalance: newBal,
      category,
      reason,
      memoryNote,
      performedBy: 'parent',
    };

    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === activeAccount.profile.id
          ? {
              ...child,
              transactions: [...child.transactions, newTx],
              profile: {
                ...child.profile,
                stats: {
                  ...child.profile.stats,
                  currentBalance: newBal,
                  totalSavedMoney:
                    direction === 'add'
                      ? child.profile.stats.totalSavedMoney + amount
                      : child.profile.stats.totalSavedMoney,
                  lastActivityDate: newTx.timestamp,
                },
              },
            }
          : child
      ),
      auditLogs: [
        ...prev.auditLogs,
        {
          id: `aud_${Date.now()}`,
          timestamp: newTx.timestamp,
          actor: 'parent',
          action: 'MONEY_TRANSACTION',
          details: `${direction.toUpperCase()} ${profile.currency}${amount} (${reason}) for ${profile.name}`,
        },
      ],
    }));

    if (direction === 'add') {
      setConfettiActive(true);
    }
  };

  // Add Points Transaction
  const handleAddPointsTx = (
    direction: TransactionDirection,
    amount: number,
    category: string,
    reason: string,
    memoryNote?: string
  ) => {
    const currentPoints = profile.stats.currentPoints;
    const newPoints =
      direction === 'add' ? currentPoints + amount : Math.max(0, currentPoints - amount);

    const newLevel = Math.max(1, Math.floor(newPoints / 150) + 1);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'points',
      direction,
      amount,
      previousBalance: currentPoints,
      newBalance: newPoints,
      category,
      reason,
      memoryNote,
      performedBy: 'parent',
    };

    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === activeAccount.profile.id
          ? {
              ...child,
              transactions: [...child.transactions, newTx],
              profile: {
                ...child.profile,
                stats: {
                  ...child.profile.stats,
                  currentPoints: newPoints,
                  level: newLevel,
                  currentMonthPoints:
                    direction === 'add'
                      ? child.profile.stats.currentMonthPoints + amount
                      : child.profile.stats.currentMonthPoints,
                  totalLifetimePoints:
                    direction === 'add'
                      ? child.profile.stats.totalLifetimePoints + amount
                      : child.profile.stats.totalLifetimePoints,
                  lastActivityDate: newTx.timestamp,
                },
              },
            }
          : child
      ),
      auditLogs: [
        ...prev.auditLogs,
        {
          id: `aud_${Date.now()}`,
          timestamp: newTx.timestamp,
          actor: 'parent',
          action: 'POINTS_TRANSACTION',
          details: `${direction.toUpperCase()} ${amount} points (${reason}) for ${profile.name}`,
        },
      ],
    }));

    if (direction === 'add') {
      setConfettiActive(true);
    }
  };

  // Reward Request by Child
  const handleRequestRedeem = (rewardId: string) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === activeAccount.profile.id
          ? {
              ...child,
              rewards: child.rewards.map((r) =>
                r.id === rewardId
                  ? { ...r, status: 'requested', requestedDate: new Date().toISOString() }
                  : r
              ),
            }
          : child
      ),
      auditLogs: [
        ...prev.auditLogs,
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'child',
          action: 'REWARD_REQUESTED',
          details: `Requested reward: ${rewards.find((r) => r.id === rewardId)?.title} by ${profile.name}`,
        },
      ],
    }));
    setConfettiActive(true);
  };

  // Approve Reward Claim
  const handleApproveRedeem = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    sound.playLevelUp(profile.preferences.soundEnabled);
    setConfettiActive(true);

    // Deduct points
    const currentPoints = profile.stats.currentPoints;
    const newPoints = Math.max(0, currentPoints - reward.pointsCost);

    const deductionTx: Transaction = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'points',
      direction: 'remove',
      amount: reward.pointsCost,
      previousBalance: currentPoints,
      newBalance: newPoints,
      category: 'Reward Redemption',
      reason: `Claimed reward: ${reward.title}`,
      performedBy: 'parent',
    };

    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.profile.id === activeAccount.profile.id
          ? {
              ...child,
              transactions: [...child.transactions, deductionTx],
              rewards: child.rewards.map((r) =>
                r.id === rewardId
                  ? {
                      ...r,
                      status: 'redeemed',
                      approvedDate: deductionTx.timestamp,
                      redeemedDate: deductionTx.timestamp,
                    }
                  : r
              ),
              profile: {
                ...child.profile,
                stats: {
                  ...child.profile.stats,
                  currentPoints: newPoints,
                },
              },
            }
          : child
      ),
      auditLogs: [
        ...prev.auditLogs,
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'parent',
          action: 'REWARD_APPROVED',
          details: `Approved reward redemption: ${reward.title} for ${reward.pointsCost} ⭐ (${profile.name})`,
        },
      ],
    }));
  };

  // Decline Reward Claim
  const handleDeclineRedeem = (rewardId: string) => {
    updateActiveChild((child) => ({
      ...child,
      rewards: child.rewards.map((r) =>
        r.id === rewardId ? { ...r, status: 'available' } : r
      ),
    }));
  };

  // Add New Custom Reward
  const handleAddReward = (rewardData: Omit<Reward, 'id' | 'status'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: `rew_${Date.now()}`,
      status: 'available',
    };
    updateActiveChild((child) => ({
      ...child,
      rewards: [...child.rewards, newReward],
    }));
  };

  // Delete Reward
  const handleDeleteReward = (rewardId: string) => {
    updateActiveChild((child) => ({
      ...child,
      rewards: child.rewards.filter((r) => r.id !== rewardId),
    }));
  };

  // Add Correcting Transaction in Ledger
  const handleAddCorrection = (
    type: 'points' | 'money',
    amount: number,
    direction: 'add' | 'remove',
    reason: string
  ) => {
    if (type === 'money') {
      handleAddMoneyTx(direction, amount, 'Ledger Correction', reason);
    } else {
      handleAddPointsTx(direction, amount, 'Ledger Correction', reason);
    }
  };

  // Reset to Seed State
  const handleResetSeed = () => {
    const initial = getInitialSeedData();
    setAppState(initial);
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-500 bg-gradient-to-br ${currentTheme.bgGradient}`}
    >
      {/* Confetti Celebration Overlay */}
      <ConfettiOverlay active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Render based on user role */}
      {currentRole === 'child' ? (
        <div className="flex-1 flex flex-col">
          {/* Child Top Navigation Header with Profile Switcher */}
          <ChildHeader
            profile={profile}
            currentTheme={profile.theme}
            onOpenParentMode={() => setShowPinModal(true)}
            onOpenProfilePicker={() => setShowProfilePickerModal(true)}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onOpenAvatarCustomizer={() => setShowAvatarModal(true)}
            onOpenThemeSelector={() => setShowThemeModal(true)}
          />

          {/* Child Main Tab Content Container */}
          <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24">
            {childTab === 'home' && (
              <ChildHome
                profile={profile}
                rewards={rewards}
                onNavigateTab={(tab) => setChildTab(tab)}
                onOpenMyBest={() => setShowMyBestModal(true)}
                onOpenTrophyRoom={() => setShowTrophyModal(true)}
                onOpenAvatarCustomizer={() => setShowAvatarModal(true)}
              />
            )}

            {childTab === 'map' && <ChildWorldMap profile={profile} />}

            {childTab === 'base' && <ChildBaseRoom profile={profile} />}

            {childTab === 'journey' && (
              <ChildJourney
                profile={profile}
                yearlyJourney={yearlyJourney}
                patienceRules={appState.patienceRules}
                onOpenPatienceSimulator={() => setShowPatienceSimModal(true)}
              />
            )}

            {childTab === 'rewards' && (
              <ChildRewards
                profile={profile}
                rewards={rewards}
                onRequestRedeem={handleRequestRedeem}
              />
            )}

            {childTab === 'history' && (
              <ChildStoryLog profile={profile} transactions={transactions} />
            )}
          </main>

          {/* Fixed Thumb-Zone Bottom Tab Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-2xl">
            <div className="max-w-lg mx-auto grid grid-cols-6 items-center">
              {[
                { id: 'home', label: 'Home', emoji: '🏠' },
                { id: 'map', label: 'Map', emoji: '🗺️' },
                { id: 'base', label: 'Sanctuary', emoji: '🏡' },
                { id: 'journey', label: '10-Yr Plan', emoji: '🧭' },
                { id: 'rewards', label: 'Rewards', emoji: '🎁' },
                { id: 'history', label: 'Story Log', emoji: '📖' },
              ].map((tab) => {
                const isSelected = childTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sound.playTap(profile.preferences.soundEnabled);
                      setChildTab(tab.id as any);
                    }}
                    className={`py-1.5 px-0.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'text-amber-300 font-extrabold scale-105'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl leading-none mb-0.5">{tab.emoji}</span>
                    <span className="text-[9px] sm:text-[10px] tracking-tight whitespace-nowrap">
                      {tab.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      ) : (
        /* Parent Command Mode */
        <ParentDashboard
          childrenAccounts={appState.children}
          activeChildId={appState.activeChildId}
          onSelectChild={handleSelectChild}
          profile={profile}
          transactions={transactions}
          rewards={rewards}
          patienceRules={appState.patienceRules}
          storedPin={appState.parentPin}
          onExitParentMode={() => setCurrentRole('child')}
          onOpenAdminPortal={() => setShowAdminPortal(true)}
          onOpenCertificate={() => setShowCertificateModal(true)}
          onOpenNewJourneyWizard={() => setShowNewJourneyModal(true)}
          onAddMoneyTx={handleAddMoneyTx}
          onAddPointsTx={handleAddPointsTx}
          onApproveRedeem={handleApproveRedeem}
          onDeclineRedeem={handleDeclineRedeem}
          onAddReward={handleAddReward}
          onDeleteReward={handleDeleteReward}
          onAddCorrection={handleAddCorrection}
          onUpdateProfile={handleUpdateProfile}
          onUpdatePin={(newPin) =>
            setAppState((prev) => ({ ...prev, parentPin: newPin }))
          }
          onUpdatePatienceRules={(rules) =>
            setAppState((prev) => ({ ...prev, patienceRules: rules }))
          }
        />
      )}

      {/* Profile Picker Modal */}
      {showProfilePickerModal && (
        <ProfilePickerModal
          childrenAccounts={appState.children}
          activeChildId={appState.activeChildId}
          onSelectChild={handleSelectChild}
          onAddNewChild={() => setShowNewJourneyModal(true)}
          onClose={() => setShowProfilePickerModal(false)}
          soundEnabled={profile.preferences.soundEnabled}
        />
      )}

      {/* Parent PIN Verification Modal */}
      {showPinModal && (
        <ParentPinModal
          storedPin={appState.parentPin}
          soundEnabled={profile.preferences.soundEnabled}
          onSuccess={() => {
            setShowPinModal(false);
            setCurrentRole('parent');
          }}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-extrabold text-lg text-white">
                  Choose Adventure World Theme
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ThemeSelector
              currentTheme={profile.theme}
              onSelectTheme={handleSelectTheme}
              soundEnabled={profile.preferences.soundEnabled}
            />
          </div>
        </div>
      )}

      {/* Avatar Customizer Modal */}
      {showAvatarModal && (
        <ChildAvatarCustomizer
          profile={profile}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* My Best Self-Competition Modal */}
      {showMyBestModal && (
        <ChildMyBestModal
          profile={profile}
          onClose={() => setShowMyBestModal(false)}
        />
      )}

      {/* Trophy Case Modal */}
      {showTrophyModal && (
        <ChildTrophyRoom
          profile={profile}
          achievements={achievements}
          onClose={() => setShowTrophyModal(false)}
        />
      )}

      {/* Developer / Admin Infrastructure Portal */}
      {showAdminPortal && (
        <AdminPortal
          appState={appState}
          onClose={() => setShowAdminPortal(false)}
          onResetSeed={handleResetSeed}
          onImportState={(newState) => setAppState(newState)}
          onUpdateFeatureFlags={(flags) =>
            setAppState((prev) => ({ ...prev, featureFlags: flags }))
          }
        />
      )}

      {/* Official Milestone Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          profile={profile}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* New Child Journey Setup Wizard */}
      {showNewJourneyModal && (
        <NewJourneyWizardModal
          onComplete={handleAddNewChild}
          onClose={() => setShowNewJourneyModal(false)}
        />
      )}

      {/* Patience Growth Simulator Modal */}
      {showPatienceSimModal && (
        <PatienceSimulatorModal
          profile={profile}
          patienceRules={appState.patienceRules}
          onClose={() => setShowPatienceSimModal(false)}
        />
      )}
    </div>
  );
}
