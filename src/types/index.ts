export type UserRole = 'child' | 'parent' | 'admin';

export type AdventureTheme =
  | 'forest'
  | 'mountain'
  | 'space'
  | 'ocean'
  | 'fantasy'
  | 'dino'
  | 'future'
  | 'galaxy';

export type AgeGroup = 'junior' | 'pathfinder' | 'master'; // 6-8, 9-12, 13-16+

export type CompanionType = 'robot' | 'dragon' | 'panda' | 'dog' | 'cat' | 'fox';

export type AccessoryType = 'explorer_hat' | 'goggles' | 'cape' | 'headphones' | 'crown' | 'none';

export interface ChildAvatar {
  gender: 'boy' | 'girl' | 'neutral';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  companion: CompanionType;
  accessory: AccessoryType;
  photoType?: 'custom' | 'portrait_girl' | 'portrait_boy' | 'avatar';
  customPhotoUrl?: string;
}

export interface ChildPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  showRealMoneyToChild: boolean;
  allowChildRedeemRequest: boolean;
  streakEnabled: boolean;
  allowNegativePoints: boolean;
}

export interface ChildStats {
  currentPoints: number;
  currentBalance: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  totalLifetimePoints: number;
  totalSavedMoney: number;
  lastActivityDate: string;
  bestMonthPoints: number;
  currentMonthPoints: number;
  previousMonthPoints: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  nickname: string;
  birthDate: string;
  currentAge: number;
  schoolGrade: string;
  ageGroup: AgeGroup;
  theme: AdventureTheme;
  currency: string;
  avatar: ChildAvatar;
  preferences: ChildPreferences;
  stats: ChildStats;
}

export type TransactionType = 'points' | 'money';
export type TransactionDirection = 'add' | 'remove';

export interface Transaction {
  id: string;
  timestamp: string; // ISO string
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  previousBalance: number;
  newBalance: number;
  category: string;
  reason: string;
  memoryNote?: string;
  performedBy: 'parent' | 'admin' | 'system';
  isCorrection?: boolean;
  correctsTxId?: string;
}

export type RewardStatus = 'available' | 'requested' | 'approved' | 'redeemed';

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  moneyCost?: number;
  icon: string;
  category: string;
  status: RewardStatus;
  requiresParentApproval: boolean;
  requestedDate?: string;
  approvedDate?: string;
  redeemedDate?: string;
  memoryNote?: string;
}

export interface WorldMilestone {
  id: string;
  worldIndex: number;
  name: string;
  requiredPoints: number;
  icon: string;
  theme: AdventureTheme;
  description: string;
  storyUnlocked: string;
  badgeName: string;
}

export interface YearlyJourneyNode {
  year: number;
  age: number;
  grade: string;
  stageName: string;
  themeIcon: string;
  pointsEarned: number;
  moneySaved: number;
  patienceBonusMultiplier: number;
  milestonesUnlocked: string[];
  memories: string[];
  isUnlocked: boolean;
  isCurrent: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'savings' | 'points' | 'consistency' | 'adventure';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface PatienceBonusRule {
  months: number;
  label: string;
  bonusPercentage: number;
  description: string;
  icon: string;
}

export interface BaseFurnitureItem {
  id: string;
  name: string;
  levelRequired: number;
  icon: string;
  category: 'furniture' | 'knowledge' | 'pet' | 'trophy' | 'decor';
  description: string;
  unlockedStory: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: 'parent' | 'admin' | 'child' | 'system';
  action: string;
  details: string;
}

export interface ChildAccount {
  profile: ChildProfile;
  transactions: Transaction[];
  rewards: Reward[];
  achievements: Achievement[];
  yearlyJourney: YearlyJourneyNode[];
}

export interface AppState {
  activeChildId: string;
  children: ChildAccount[];
  patienceRules: PatienceBonusRule[];
  auditLogs: AuditLog[];
  parentPin: string; // Stored hashed or encoded
  adminPassphraseHash: string;
  featureFlags: {
    audioSynthesizer: boolean;
    ageAdaptiveStyling: boolean;
    highContrastMode: boolean;
    patienceCalculator: boolean;
  };
}
