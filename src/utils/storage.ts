import { AppState, ChildAccount, Transaction, Reward, YearlyJourneyNode } from '../types';
import { INITIAL_ACHIEVEMENTS, DEFAULT_PATIENCE_RULES, PRESET_CHILD_PORTRAITS } from './constants';

const STORAGE_KEY = 'odyssey_adventure_piggy_v1';

export function getInitialSeedData(): AppState {
  const initialTransactions: Transaction[] = [
    {
      id: 'tx_seed_1',
      timestamp: '2024-06-15T09:30:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 500,
      previousBalance: 0,
      newBalance: 500,
      category: 'Birthday Gift',
      reason: '7th Birthday from Grandma & Grandpa',
      memoryNote: 'Grandma hugged you tight and gave a crisp green ₹500 note for your savings!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_2',
      timestamp: '2024-07-02T15:00:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 50,
      previousBalance: 0,
      newBalance: 50,
      category: 'Reading',
      reason: 'Finished reading "The Magic Finger"',
      memoryNote: 'Read 3 chapters before bedtime without reminder.',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_3',
      timestamp: '2024-10-18T11:20:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 1500,
      previousBalance: 500,
      newBalance: 2000,
      category: 'Diwali / Festival',
      reason: 'Festival gift from Uncle & Aunt',
      memoryNote: 'Diwali sweets and savings envelope!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_4',
      timestamp: '2024-12-25T18:00:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 120,
      previousBalance: 50,
      newBalance: 170,
      category: 'Responsibility',
      reason: 'Kept school backpack organized for a month',
      memoryNote: 'Proud smile when morning packing was ready!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_5',
      timestamp: '2025-01-10T12:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 2500,
      previousBalance: 2000,
      newBalance: 4500,
      category: 'Allowance',
      reason: 'Half-yearly savings deposit',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_6',
      timestamp: '2025-03-24T16:45:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 180,
      previousBalance: 170,
      newBalance: 350,
      category: 'Learning',
      reason: 'Math Olympiad Gold Star Certificate',
      memoryNote: 'Practiced times tables every evening with Dad.',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_7',
      timestamp: '2025-06-15T10:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 2000,
      previousBalance: 4500,
      newBalance: 6500,
      category: 'Birthday Gift',
      reason: '8th Birthday Celebration',
      memoryNote: 'Celebrated with chocolate cake and promised to save for a big telescope!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_8',
      timestamp: '2025-08-30T17:15:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 400,
      previousBalance: 350,
      newBalance: 750,
      category: 'Reading',
      reason: 'Completed 10 Chapter Books in Summer',
      memoryNote: 'Summertime library badge unlocked!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_9',
      timestamp: '2025-11-12T14:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 3000,
      previousBalance: 6500,
      newBalance: 9500,
      category: 'Festival Gift',
      reason: 'Family savings contribution',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_10',
      timestamp: '2026-01-05T09:00:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 200,
      previousBalance: 750,
      newBalance: 950,
      category: 'Patience Bonus',
      reason: '6-Month Patience Reward from Piggy Bank',
      memoryNote: 'Did not spend impulse coins; bonus points granted!',
      performedBy: 'system',
    },
    {
      id: 'tx_seed_11',
      timestamp: '2026-03-01T12:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 3000,
      previousBalance: 9500,
      newBalance: 12500,
      category: 'Exam Milestone',
      reason: 'Class 2 Annual Excellence Reward',
      memoryNote: 'Passed to Class 3 with flying colors and teacher praise!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_12',
      timestamp: '2026-09-28T16:30:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 240,
      previousBalance: 950,
      newBalance: 1190,
      category: 'Sports & Health',
      reason: 'Daily swimming lessons & bicycle milestone',
      memoryNote: 'Rode bike without training wheels all the way across the park!',
      performedBy: 'parent',
    },
    {
      id: 'tx_seed_13',
      timestamp: '2026-10-06T18:10:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 50,
      previousBalance: 1190,
      newBalance: 1240,
      category: 'Kindness & Home',
      reason: 'Helped younger cousin with puzzle and cleaned desk',
      memoryNote: 'Mom noticed kindness and added milestone stars.',
      performedBy: 'parent',
    },
  ];

  const initialRewards: Reward[] = [
    {
      id: 'rew_1',
      title: 'Illustrated Fantasy Book',
      description: 'A beautiful hardcover adventure storybook for your bedside table.',
      pointsCost: 500,
      icon: '📚',
      category: 'Books',
      status: 'redeemed',
      requiresParentApproval: true,
      redeemedDate: '2025-05-10T12:00:00Z',
      memoryNote: 'Read it together every evening before bed!',
    },
    {
      id: 'rew_2',
      title: 'Deluxe Watercolor Art Kit',
      description: 'Professional paint palette with 24 colors, sketch pad, and wooden brushes.',
      pointsCost: 1000,
      icon: '🎨',
      category: 'Creativity',
      status: 'redeemed',
      requiresParentApproval: true,
      redeemedDate: '2025-10-20T14:30:00Z',
      memoryNote: 'Painted the sunset landscape that is framed in your room.',
    },
    {
      id: 'rew_3',
      title: 'Science Planetarium Night',
      description: 'A special Saturday evening visit to the city dome planetarium & ice cream.',
      pointsCost: 1400,
      icon: '🔭',
      category: 'Experience',
      status: 'available',
      requiresParentApproval: true,
    },
    {
      id: 'rew_4',
      title: 'Custom Lego Starship',
      description: 'A 500-piece explorer starship with glowing cockpit and lunar rover.',
      pointsCost: 2000,
      icon: '🚀',
      category: 'Toys',
      status: 'available',
      requiresParentApproval: true,
    },
    {
      id: 'rew_5',
      title: 'High-Power Stargazer Telescope',
      description: 'Your dream telescope to see lunar craters, Saturn rings, and Jupiter moons!',
      pointsCost: 5000,
      moneyCost: 10000,
      icon: '🌌',
      category: 'Grand Goal',
      status: 'available',
      requiresParentApproval: true,
    },
    {
      id: 'rew_6',
      title: 'Adventure Theme Park Weekend',
      description: 'All-day rollercoasters, water slides, and family weekend fun!',
      pointsCost: 3500,
      icon: '🎢',
      category: 'Experience',
      status: 'available',
      requiresParentApproval: true,
    },
  ];

  const yearlyJourney: YearlyJourneyNode[] = [
    {
      year: 2024,
      age: 6,
      grade: 'Class 1',
      stageName: 'The First Spark',
      themeIcon: '🌱',
      pointsEarned: 420,
      moneySaved: 2000,
      patienceBonusMultiplier: 1.05,
      milestonesUnlocked: ['Starting Village', 'Village Pioneer'],
      memories: [
        'Started your 10-year growth odyssey!',
        'Saved first ₹500 birthday note from Grandma.',
        'Read Charlotte’s Web.',
      ],
      isUnlocked: true,
      isCurrent: false,
    },
    {
      year: 2025,
      age: 7,
      grade: 'Class 2',
      stageName: 'Enchanted Explorer',
      themeIcon: '🌳',
      pointsEarned: 580,
      moneySaved: 7500,
      patienceBonusMultiplier: 1.1,
      milestonesUnlocked: ['Enchanted Forest', 'Forest Ranger', 'Peak Climber'],
      memories: [
        'Reached Crystal Mountain summit at 750 ⭐',
        'Won school Math Olympiad Star',
        'Held savings for 12 straight months without breaking bank.',
      ],
      isUnlocked: true,
      isCurrent: false,
    },
    {
      year: 2026,
      age: 8,
      grade: 'Class 3',
      stageName: 'Mountain Champion',
      themeIcon: '🏔️',
      pointsEarned: 1240,
      moneySaved: 12500,
      patienceBonusMultiplier: 1.2,
      milestonesUnlocked: ['Mountain Summit', 'Guardian of Patience'],
      memories: [
        'Current Year: Only 260 ⭐ to unlock Ancient Castle!',
        'Personal Best Streak: 30 days active learning.',
        'Beat last month by +90 points!',
      ],
      isUnlocked: true,
      isCurrent: true,
    },
    {
      year: 2027,
      age: 9,
      grade: 'Class 4',
      stageName: 'Castle Knight',
      themeIcon: '🏰',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.25,
      milestonesUnlocked: ['Ancient Castle Gate'],
      memories: ['Goal: Gather 2,000 ⭐ & build first science robotics kit.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2028,
      age: 10,
      grade: 'Class 5',
      stageName: 'Ocean Navigator',
      themeIcon: '🌊',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.3,
      milestonesUnlocked: ['Coral Ocean Deep'],
      memories: ['Goal: Master swimming, dive into secondary school with confidence.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2029,
      age: 11,
      grade: 'Class 6',
      stageName: 'Cosmic Pioneer',
      themeIcon: '🚀',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.35,
      milestonesUnlocked: ['Cosmic Orbit'],
      memories: ['Goal: First telescope stargazing campout.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2030,
      age: 12,
      grade: 'Class 7',
      stageName: 'Lunar Guardian',
      themeIcon: '🌙',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.4,
      milestonesUnlocked: ['Moon Base'],
      memories: ['Goal: Halfway through 10-year odyssey! Major patience jackpot.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2031,
      age: 13,
      grade: 'Class 8',
      stageName: 'Teen Pathfinder',
      themeIcon: '⚡',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.5,
      milestonesUnlocked: ['High Orbit'],
      memories: ['Goal: Independent financial planning & coding projects.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2032,
      age: 14,
      grade: 'Class 9',
      stageName: 'Galaxy Voyager',
      themeIcon: '🌌',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.6,
      milestonesUnlocked: ['Deep Galaxy'],
      memories: ['Goal: High school excellence and long-term investment mindset.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2033,
      age: 15,
      grade: 'Class 10',
      stageName: 'Constellation Master',
      themeIcon: '🪐',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.75,
      milestonesUnlocked: ['Star Matrix'],
      memories: ['Goal: Major milestone graduation exams & scholarship fund.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2034,
      age: 16,
      grade: 'Class 11',
      stageName: 'Future Architect',
      themeIcon: '🤖',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 1.9,
      milestonesUnlocked: ['Cyber Summit'],
      memories: ['Goal: College prep & leadership portfolio.'],
      isUnlocked: false,
      isCurrent: false,
    },
    {
      year: 2035,
      age: 17,
      grade: 'Class 12',
      stageName: 'Odyssey Supreme',
      themeIcon: '⭐',
      pointsEarned: 0,
      moneySaved: 0,
      patienceBonusMultiplier: 2.0,
      milestonesUnlocked: ['Future World Pinnacle'],
      memories: [
        'The Ultimate 10-Year Summit! Unlocks complete lifetime savings chest & memory journal.',
      ],
      isUnlocked: false,
      isCurrent: false,
    },
  ];

  const harshitaChild: ChildAccount = {
    profile: {
      id: 'child_harshita',
      name: 'Harshita',
      nickname: 'Harshu',
      birthDate: '2018-06-15',
      currentAge: 8,
      schoolGrade: 'Class 3',
      ageGroup: 'junior',
      theme: 'mountain',
      currency: '₹',
      avatar: {
        gender: 'girl',
        skinTone: '#FCD34D',
        hairStyle: 'twin_braids',
        hairColor: '#451A03',
        outfitColor: '#0284C7',
        companion: 'dragon',
        accessory: 'explorer_hat',
        photoType: 'portrait_girl',
        customPhotoUrl: PRESET_CHILD_PORTRAITS.portrait_girl,
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
        currentPoints: 1240,
        currentBalance: 12500,
        currentStreak: 12,
        bestStreak: 30,
        level: 8,
        totalLifetimePoints: 1440,
        totalSavedMoney: 12500,
        lastActivityDate: '2026-10-06T18:10:00.000Z',
        bestMonthPoints: 510,
        currentMonthPoints: 510,
        previousMonthPoints: 420,
      },
    },
    transactions: initialTransactions,
    rewards: initialRewards,
    achievements: INITIAL_ACHIEVEMENTS,
    yearlyJourney,
  };

  const kabirTransactions: Transaction[] = [
    {
      id: 'tx_kabir_1',
      timestamp: '2026-06-15T10:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 1000,
      previousBalance: 0,
      newBalance: 1000,
      category: 'Birthday Gift',
      reason: '6th Birthday gift from Grandpa',
      memoryNote: 'Grandpa said to save this for your space rocket adventure!',
      performedBy: 'parent',
    },
    {
      id: 'tx_kabir_2',
      timestamp: '2026-07-20T14:30:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 50,
      previousBalance: 0,
      newBalance: 50,
      category: 'Learning',
      reason: 'Learned the solar system song',
      memoryNote: 'Sang all 8 planets in order without missing any!',
      performedBy: 'parent',
    },
    {
      id: 'tx_kabir_3',
      timestamp: '2026-08-14T11:00:00.000Z',
      type: 'money',
      direction: 'add',
      amount: 1000,
      previousBalance: 1000,
      newBalance: 2000,
      category: 'Family Gift',
      reason: 'Savings boost from Mom & Dad',
      memoryNote: 'Kept toys tidy for a full week!',
      performedBy: 'parent',
    },
    {
      id: 'tx_kabir_4',
      timestamp: '2026-09-02T16:00:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 150,
      previousBalance: 50,
      newBalance: 200,
      category: 'Reading',
      reason: 'Completed 5 phonics storybooks',
      memoryNote: 'Read out loud before bedtime with huge smiles.',
      performedBy: 'parent',
    },
    {
      id: 'tx_kabir_5',
      timestamp: '2026-10-04T17:45:00.000Z',
      type: 'points',
      direction: 'add',
      amount: 180,
      previousBalance: 200,
      newBalance: 380,
      category: 'Kindness',
      reason: 'Helped big sister with puzzles & shared crayons',
      memoryNote: 'Shared colors nicely and gave a big hug.',
      performedBy: 'parent',
    },
  ];

  const kabirRewards: Reward[] = [
    {
      id: 'rew_kabir_1',
      title: 'Illustrated Astronomy Book',
      description: 'Big picture book showing stars, comets, and astronauts.',
      pointsCost: 300,
      icon: '📚',
      category: 'Books',
      status: 'available',
      requiresParentApproval: true,
    },
    {
      id: 'rew_kabir_2',
      title: 'Glowing Galaxy Night Light',
      description: 'Projects stars and constellations across your bedroom ceiling.',
      pointsCost: 500,
      icon: '✨',
      category: 'Decor',
      status: 'available',
      requiresParentApproval: true,
    },
    {
      id: 'rew_kabir_3',
      title: 'Remote Control Mars Rover',
      description: 'Motorized rover that climbs over pillow craters!',
      pointsCost: 1200,
      icon: '🚀',
      category: 'Toys',
      status: 'available',
      requiresParentApproval: true,
    },
  ];

  const kabirYearlyJourney: YearlyJourneyNode[] = Array.from({ length: 12 }, (_, i) => {
    const yr = 2026 + i;
    const icons = ['🚀', '🌙', '🌌', '🪐', '⭐', '🤖', '🛰️', '🛸', '☄️', '🌟', '🏆', '👑'];
    return {
      year: yr,
      age: 6 + i,
      grade: `Class ${1 + i}`,
      stageName: i === 0 ? 'Space Cadet Spark' : `Cadet Level ${i + 1}`,
      themeIcon: icons[i % icons.length],
      pointsEarned: i === 0 ? 380 : 0,
      moneySaved: i === 0 ? 2000 : 0,
      patienceBonusMultiplier: 1 + i * 0.1,
      milestonesUnlocked: i === 0 ? ['Starting Village', 'Star Astronaut'] : [],
      memories: i === 0 ? ['Launched personal 10-year space odyssey with Nova the Robot!'] : [],
      isUnlocked: i === 0,
      isCurrent: i === 0,
    };
  });

  const kabirChild: ChildAccount = {
    profile: {
      id: 'child_kabir',
      name: 'Kabir',
      nickname: 'Kabi',
      birthDate: '2020-04-10',
      currentAge: 6,
      schoolGrade: 'Class 1',
      ageGroup: 'junior',
      theme: 'space',
      currency: '₹',
      avatar: {
        gender: 'boy',
        skinTone: '#FCD34D',
        hairStyle: 'spiky',
        hairColor: '#1E293B',
        outfitColor: '#2563EB',
        companion: 'robot',
        accessory: 'goggles',
        photoType: 'portrait_boy',
        customPhotoUrl: PRESET_CHILD_PORTRAITS.portrait_boy,
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
        currentPoints: 380,
        currentBalance: 2000,
        currentStreak: 7,
        bestStreak: 14,
        level: 3,
        totalLifetimePoints: 380,
        totalSavedMoney: 2000,
        lastActivityDate: '2026-10-04T17:45:00.000Z',
        bestMonthPoints: 180,
        currentMonthPoints: 180,
        previousMonthPoints: 120,
      },
    },
    transactions: kabirTransactions,
    rewards: kabirRewards,
    achievements: INITIAL_ACHIEVEMENTS,
    yearlyJourney: kabirYearlyJourney,
  };

  return {
    activeChildId: 'child_harshita',
    children: [harshitaChild, kabirChild],
    patienceRules: DEFAULT_PATIENCE_RULES,
    auditLogs: [
      {
        id: 'aud_1',
        timestamp: '2024-06-15T09:30:00.000Z',
        actor: 'system',
        action: 'JOURNEY_INITIALIZED',
        details: 'Harshita’s 10-year adventure journal profile was created by parent.',
      },
      {
        id: 'aud_2',
        timestamp: '2026-06-15T10:00:00.000Z',
        actor: 'system',
        action: 'JOURNEY_INITIALIZED',
        details: 'Kabir’s 10-year adventure journal profile was created by parent.',
      },
    ],
    parentPin: '1234', // Default parent PIN
    adminPassphraseHash: 'admin2026',
    featureFlags: {
      audioSynthesizer: true,
      ageAdaptiveStyling: true,
      highContrastMode: false,
      patienceCalculator: true,
    },
  };
}

export function loadAppState(): AppState {
  if (typeof window === 'undefined') return getInitialSeedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedData();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as any;

    // Automatic migration from single-child schema to multi-child schema
    if (parsed.profile && !parsed.children) {
      const singleChild: ChildAccount = {
        profile: parsed.profile,
        transactions: parsed.transactions || [],
        rewards: parsed.rewards || [],
        achievements: parsed.achievements || [],
        yearlyJourney: parsed.yearlyJourney || [],
      };
      const migratedState: AppState = {
        activeChildId: singleChild.profile.id,
        children: [singleChild],
        patienceRules: parsed.patienceRules || DEFAULT_PATIENCE_RULES,
        auditLogs: parsed.auditLogs || [],
        parentPin: parsed.parentPin || '1234',
        adminPassphraseHash: parsed.adminPassphraseHash || 'admin2026',
        featureFlags: parsed.featureFlags || {
          audioSynthesizer: true,
          ageAdaptiveStyling: true,
          highContrastMode: false,
          patienceCalculator: true,
        },
      };
      saveAppState(migratedState);
      return migratedState;
    }

    if (!parsed.children || !Array.isArray(parsed.children) || parsed.children.length === 0) {
      return getInitialSeedData();
    }
    return parsed as AppState;
  } catch (err) {
    console.warn('Failed to parse saved state, using seed:', err);
    return getInitialSeedData();
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save app state to localStorage:', err);
  }
}

/**
 * Verify Ledger Integrity:
 * Calculates total money & points from transaction records and compares with profile state
 * for the active child or specified child.
 */
export function verifyLedgerIntegrity(state: AppState, targetChildId?: string): {
  isValid: boolean;
  computedMoney: number;
  computedPoints: number;
  profileMoney: number;
  profilePoints: number;
  childName: string;
  mismatchReason?: string;
} {
  const child =
    state.children.find((c) => c.profile.id === (targetChildId || state.activeChildId)) ||
    state.children[0];

  let computedMoney = 0;
  let computedPoints = 0;

  if (child) {
    for (const tx of child.transactions) {
      if (tx.isCorrection) continue;
      if (tx.type === 'money') {
        if (tx.direction === 'add') {
          computedMoney += tx.amount;
        } else {
          computedMoney -= tx.amount;
        }
      } else if (tx.type === 'points') {
        if (tx.direction === 'add') {
          computedPoints += tx.amount;
        } else {
          computedPoints -= tx.amount;
        }
      }
    }
  }

  const profileMoney = child?.profile.stats.currentBalance ?? 0;
  const profilePoints = child?.profile.stats.currentPoints ?? 0;
  const childName = child?.profile.name ?? 'Unknown';

  const moneyMatch = Math.abs(computedMoney - profileMoney) < 0.01;
  const pointsMatch = computedPoints === profilePoints;

  let mismatchReason: string | undefined = undefined;
  if (!moneyMatch || !pointsMatch) {
    mismatchReason = `Discrepancy for ${childName}: Money ledger calculates ${computedMoney} vs profile ${profileMoney}; Points ledger calculates ${computedPoints} vs profile ${profilePoints}`;
  }

  return {
    isValid: moneyMatch && pointsMatch,
    computedMoney,
    computedPoints,
    profileMoney,
    profilePoints,
    childName,
    mismatchReason,
  };
}

export function exportAppStateToJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function exportTransactionsToCsv(transactions: Transaction[]): string {
  const headers = [
    'ID',
    'Date & Time',
    'Type',
    'Direction',
    'Amount',
    'Previous Balance',
    'New Balance',
    'Category',
    'Reason',
    'Memory Note',
    'Performed By',
  ];

  const rows = transactions.map((tx) => [
    `"${tx.id}"`,
    `"${tx.timestamp}"`,
    `"${tx.type}"`,
    `"${tx.direction}"`,
    tx.amount,
    tx.previousBalance,
    tx.newBalance,
    `"${(tx.category || '').replace(/"/g, '""')}"`,
    `"${(tx.reason || '').replace(/"/g, '""')}"`,
    `"${(tx.memoryNote || '').replace(/"/g, '""')}"`,
    `"${tx.performedBy}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
