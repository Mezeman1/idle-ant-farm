import {defineStore} from 'pinia'
import {useAdventureStore} from '@/stores/adventureStore'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {toast} from 'vue3-toastify'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useSettingsStore} from '@/stores/settingsStore'
import BigNumber from 'bignumber.js'

interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockCondition: () => boolean; // A function to check if the achievement is unlocked
  progress?: () => number; // A function to calculate the progress of an achievement
  reward?: AchievementReward; // An optional reward for the achievement
}

interface AchievementReward {
  description: string;
  isClaimed: boolean;
  onClaim: () => void;
}

export const useAchievementStore = defineStore('achievementStore', {
  state: () => ({
    totals: {
      seeds: new BigNumber(0),
      ants: new BigNumber(0),
      queens: new BigNumber(0),
      larvae: new BigNumber(0),
      enemyKills: new BigNumber(0),
      timesPrestiged: new BigNumber(0),
    },
    achievements: [
      {
        id: 'first_100_seeds',
        name: 'Seed Collector',
        description: 'Collect 100 seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 100,
        progress: () => useAchievementStore().totals.seeds / 100,
      },
      {
        id: 'first_1000_seeds',
        name: 'Seed Hoarder',
        description: 'Collect 1,000 seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 1000,
        progress: () => useAchievementStore().totals.seeds / 1000,
      },
      {
        id: 'first_10000_seeds',
        name: 'Seed Master',
        description: 'Collect 10,000 seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 10000,
        progress: () => useAchievementStore().totals.seeds / 10000,

        reward: {
          description: 'Ants now produce 10% more seeds.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.collectionRateModifier += 0.1
          },
        },
      },
      {
        id: 'first_100000_seeds',
        name: 'Seed Tycoon',
        description: 'Collect 100,000 seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 100000,
        progress: () => useAchievementStore().totals.seeds / 100000,
        reward: {
          description: 'Ants now produce 100% more seeds.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.collectionRateModifier += 1
          },
        },
      },
      {
        id: 'first_1_million_seeds',
        name: 'Seed Millionaire',
        description: 'Collect 1 million seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 1_000_000,
        progress: () => useAchievementStore().totals.seeds / 1_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 0.1
          },
        },
      },
      {
        id: 'first_10_million_seeds',
        name: 'Seed Multimillionaire',
        description: 'Collect 10 million seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 10_000_000,
        progress: () => useAchievementStore().totals.seeds / 10_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 0.1
          },
        },
      },
      {
        id: 'first_100_million_seeds',
        name: 'Seed Billionaire',
        description: 'Collect 100 million seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 100_000_000,
        progress: () => useAchievementStore().totals.seeds / 100_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 50%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 0.5
          },
        },
      },
      {
        id: 'first_1_billion_seeds',
        name: 'Seed Titan',
        description: 'Collect 1 billion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 1_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 1_000_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 100%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 1
          },
        },
      },
      {
        id: 'first_10_billion_seeds',
        name: 'Seed Overlord',
        description: 'Collect 10 billion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 10_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 10_000_000_000,
      },
      {
        id: 'first_100_billion_seeds',
        name: 'Seed Magnate',
        description: 'Collect 100 billion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 100_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 100_000_000_000,
      },
      {
        id: 'first_1_trillion_seeds',
        name: 'Seed Emperor',
        description: 'Collect 1 trillion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 1_000_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 1_000_000_000_000,
      },
      {
        id: 'first_10_trillion_seeds',
        name: 'Seed God',
        description: 'Collect 10 trillion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 10_000_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 10_000_000_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 100%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 1
          },
        },
      },
      {
        id: 'first_100_trillion_seeds',
        name: 'Seed Deity',
        description: 'Collect 100 trillion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 100_000_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 100_000_000_000_000,
      },
      {
        id: 'first_1_quadrillion_seeds',
        name: 'Seed Eternal',
        description: 'Collect 1 quadrillion seeds.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.seeds >= 1_000_000_000_000_000,
        progress: () => useAchievementStore().totals.seeds / 1_000_000_000_000_000,

        reward: {
          description: 'How many larvae do you need? Larvae storage increased by 1000%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 10
          },
        },
      },

      // Ant Creation Achievements
      {
        id: 'first_50_ants',
        name: 'Ant Keeper',
        description: 'Create 50 ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50,
        progress: () => useAchievementStore().totals.ants / 50,

        reward: {
          description: 'Ant storage capacity increased by 5%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.ant += 0.05
          },
        },
      },
      {
        id: 'first_500_ants',
        name: 'Ant Commander',
        description: 'Create 500 ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500,
        progress: () => useAchievementStore().totals.ants / 500,

        reward: {
          description: 'Ant storage capacity increased by 5%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.ant += 0.05
          },
        },
      },
      {
        id: 'first_5000_ants',
        name: 'Ant General',
        description: 'Create 5,000 ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 5000,
        progress: () => useAchievementStore().totals.ants / 5000,

        reward: {
          description: 'Ant storage capacity increased by 10% and ants are now 10% stronger.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.ant += 0.1
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 0.1
            adventureStore.armyDefenseModifier += 0.1
            adventureStore.armyMaxHealthModifier += 0.1
            adventureStore.armyRegenModifier += 0.1
          },
        },
      },
      {
        id: 'first_50000_ants',
        name: 'Ant Warlord',
        description: 'Create 50,000 ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50000,
        progress: () => useAchievementStore().totals.ants / 50000,

        reward: {
          description: 'Ant storage capacity increased by 10% and ants are now 10% stronger.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.ant += 0.1
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 0.1
            adventureStore.armyDefenseModifier += 0.1
            adventureStore.armyMaxHealthModifier += 0.1
            adventureStore.armyRegenModifier += 0.1
          },
        },
      },
      {
        id: 'first_500000_ants',
        name: 'Ant King',
        description: 'Create 500,000 ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500000,
        progress: () => useAchievementStore().totals.ants / 500000,

        reward: {
          description: 'Ants are now 100% stronger.',
          isClaimed: false,
          onClaim: () => {
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 1
            adventureStore.armyDefenseModifier += 1
            adventureStore.armyMaxHealthModifier += 1
            adventureStore.armyRegenModifier += 1
          },
        },
      },
      {
        id: 'first_5_million_ants',
        name: 'Ant Emperor',
        description: 'Create 5 million ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 5_000_000,
        progress: () => useAchievementStore().totals.ants / 5_000_000,

        reward: {
          description: 'Storage capacity for seeds increased by 100% and storage capacity for ants increased by 100%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.seed += 1
            useResourcesStore().achievementModifiers.storage.ant += 1
          },
        },
      },
      {
        id: 'first_50_million_ants',
        name: 'Ant Overlord',
        description: 'Create 50 million ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50_000_000,
        progress: () => useAchievementStore().totals.ants / 50_000_000,
      },
      {
        id: 'first_500_million_ants',
        name: 'Ant God',
        description: 'Create 500 million ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500_000_000,
        progress: () => useAchievementStore().totals.ants / 500_000_000,
      },
      {
        id: 'first_5_billion_ants',
        name: 'Ant Supreme',
        description: 'Create 5 billion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 5_000_000_000,
        progress: () => useAchievementStore().totals.ants / 5_000_000_000,
      },
      {
        id: 'first_50_billion_ants',
        name: 'Ant Titan',
        description: 'Create 50 billion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50_000_000_000,
        progress: () => useAchievementStore().totals.ants / 50_000_000_000,
      },
      {
        id: 'first_500_billion_ants',
        name: 'Ant Immortal',
        description: 'Create 500 billion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500_000_000_000,
        progress: () => useAchievementStore().totals.ants / 500_000_000_000,
      },
      {
        id: 'first_5_trillion_ants',
        name: 'Ant Deity',
        description: 'Create 5 trillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 5_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 5_000_000_000_000,
      },
      {
        id: 'first_50_trillion_ants',
        name: 'Ant Eternal',
        description: 'Create 50 trillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 50_000_000_000_000,
      },
      {
        id: 'first_500_trillion_ants',
        name: 'Ant Infinity',
        description: 'Create 500 trillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 500_000_000_000_000,
      },
      {
        id: 'first_5_quadrillion_ants',
        name: 'Ant Omnipotent',
        description: 'Create 5 quadrillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 5_000_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 5_000_000_000_000_000,
      },
      {
        id: 'first_50_quadrillion_ants',
        name: 'Ant Eternal',
        description: 'Create 50 quadrillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 50_000_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 50_000_000_000_000_000,
      },
      {
        id: 'first_500_quadrillion_ants',
        name: 'Ant Universal',
        description: 'Create 500 quadrillion ants.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.ants >= 500_000_000_000_000_000,
        progress: () => useAchievementStore().totals.ants / 500_000_000_000_000_000,
      },

      // Queen Creation Achievements
      {
        id: 'create_1_queen',
        name: 'Royalty Raiser',
        description: 'Create 1 Queen ant.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 1,
        progress: () => useAchievementStore().totals.queens / 1,
      },
      {
        id: 'create_5_queens',
        name: 'Queen Caretaker',
        description: 'Create 5 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 5,
        progress: () => useAchievementStore().totals.queens / 5,
      },
      {
        id: 'create_10_queens',
        name: 'Queen Commander',
        description: 'Create 10 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 10,
        progress: () => useAchievementStore().totals.queens / 10,
      },
      {
        id: 'create_15_queens',
        name: 'Queen Keeper',
        description: 'Create 15 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 15,
        progress: () => useAchievementStore().totals.queens / 15,

        reward: {
          description: 'Queen storage capacity increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.queen += 0.1
          },
        },
      },
      {
        id: 'create_25_queens',
        name: 'Royal Overseer',
        description: 'Create 25 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 25,
        progress: () => useAchievementStore().totals.queens / 25,

        reward: {
          description: 'Queens now produce 10% more larvae.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.larvaeProductionModifier += 0.1
          },
        },
      },
      {
        id: 'create_50_queens',
        name: 'Queen Warden',
        description: 'Create 50 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 50,
        progress: () => useAchievementStore().totals.queens / 50,

        reward: {
          description: 'Queen storage capacity increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.queen += 0.1
          },
        },
      },
      {
        id: 'create_100_queens',
        name: 'Queen Regent',
        description: 'Create 100 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 100,
        progress: () => useAchievementStore().totals.queens / 100,

        reward: {
          description: 'Queen storage capacity increased by 50%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.queen += 0.5
          },
        },
      },
      {
        id: 'create_250_queens',
        name: 'Royal Monarch',
        description: 'Create 250 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 250,
        progress: () => useAchievementStore().totals.queens / 250,

        reward: {
          description: 'Queens now produce 50% more larvae.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.larvaeProductionModifier += 0.5
          },
        },
      },
      {
        id: 'create_500_queens',
        name: 'Queen Sovereign',
        description: 'Create 500 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 500,
        progress: () => useAchievementStore().totals.queens / 500,
      },
      {
        id: 'create_1000_queens',
        name: 'Queen Empress',
        description: 'Create 1,000 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 1000,
        progress: () => useAchievementStore().totals.queens / 1000,
      },
      {
        id: 'create_5000_queens',
        name: 'Queen Supreme',
        description: 'Create 5,000 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 5000,
        progress: () => useAchievementStore().totals.queens / 5000,
      },
      {
        id: 'create_10000_queens',
        name: 'Queen Eternal',
        description: 'Create 10,000 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 10000,
        progress: () => useAchievementStore().totals.queens / 10000,
      },
      {
        id: 'create_50000_queens',
        name: 'Queen Infinite',
        description: 'Create 50,000 Queens.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.queens >= 50000,
        progress: () => useAchievementStore().totals.queens / 50000,
      },

      // Larvae Production Achievements
      {
        id: 'first_10_larvae',
        name: 'Larvae Amateur',
        description: 'Produce 10 larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10,
        progress: () => useAchievementStore().totals.larvae / 10,
      },
      {
        id: 'first_100_larvae',
        name: 'Larvae Producer',
        description: 'Produce 100 larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 100,
        progress: () => useAchievementStore().totals.larvae / 100,
      },
      {
        id: 'produce_1000_larvae',
        name: 'Larvae Breeder',
        description: 'Produce 1,000 larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 1000,
        progress: () => useAchievementStore().totals.larvae / 1000,

        reward: {
          description: 'Larvae storage capacity increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 0.1
          },
        },
      },
      {
        id: 'produce_10000_larvae',
        name: 'Larvae Master',
        description: 'Produce 10,000 larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10000,
        progress: () => useAchievementStore().totals.larvae / 10000,
        reward: {
          description: 'Larvae storage capacity increased by 10%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 0.1
          },
        },
      },
      {
        id: 'produce_100000_larvae',
        name: 'Larvae Lord',
        description: 'Produce 100,000 larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 100000,
        progress: () => useAchievementStore().totals.larvae / 100000,
      },
      {
        id: 'produce_1_million_larvae',
        name: 'Larvae Magnate',
        description: 'Produce 1 million larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 1_000_000,
        progress: () => useAchievementStore().totals.larvae / 1_000_000,
        reward: {
          description: 'Larvae storage capacity increased by 100%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 1
          },
        },
      },
      {
        id: 'produce_10_million_larvae',
        name: 'Larvae Emperor',
        description: 'Produce 10 million larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10_000_000,
        progress: () => useAchievementStore().totals.larvae / 10_000_000,
        reward: {
          description: 'Larvae storage capacity increased by 150%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 1.5
          },
        },
      },
      {
        id: 'produce_100_million_larvae',
        name: 'Larvae Overlord',
        description: 'Produce 100 million larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 100_000_000,
        progress: () => useAchievementStore().totals.larvae / 100_000_000,
        reward: {
          description: 'You\'ll need this.. trust me. Increases larvae storage capacity by 500%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 5
          },
        },
      },
      {
        id: 'produce_1_billion_larvae',
        name: 'Larvae Titan',
        description: 'Produce 1 billion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 1_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 1_000_000_000,
      },
      {
        id: 'produce_10_billion_larvae',
        name: 'Larvae God',
        description: 'Produce 10 billion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 10_000_000_000,
        reward: {
          description: 'Larvae production is doubled!',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.larvaeProductionModifier *= 2
          },
        },
      },
      {
        id: 'produce_100_billion_larvae',
        name: 'Larvae Eternal',
        description: 'Produce 100 billion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 100_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 100_000_000_000,
      },
      {
        id: 'produce_1_trillion_larvae',
        name: 'Larvae Infinite',
        description: 'Produce 1 trillion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 1_000_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 1_000_000_000_000,
        reward: {
          description: 'You\'re an achievement hunter, ha? Increases both larvae storage capacity and larvae production by 250%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 2.5
            useResourcesStore().productionRates.larvaeProductionModifier += 2.5
          },
          shouldOnlyClaimOnce: true,
        },
      },
      {
        id: 'produce_10_trillion_larvae',
        name: 'Larvae Deity',
        description: 'Produce 10 trillion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10_000_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 10_000_000_000_000,
        reward: {
          description: 'Ha, you\'re still here? Production of larvae increased by 100%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().productionRates.larvaeProductionModifier *= 2
          },
        },
      },
      {
        id: 'produce_100_trillion_larvae',
        name: 'Larvae Supreme',
        description: 'Produce 100 trillion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 100_000_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 100_000_000_000_000,
      },
      {
        id: 'produce_1_quadrillion_larvae',
        name: 'Larvae Omnipotent',
        description: 'Produce 1 quadrillion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 1_000_000_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 1_000_000_000_000_000,
        reward: {
          description: 'How many larvae do you need? Larvae storage increased by 1000%.',
          isClaimed: false,
          onClaim: () => {
            useResourcesStore().achievementModifiers.storage.larvae += 10
          },
          shouldOnlyClaimOnce: true,
        },
      },
      {
        id: 'produce_10_quadrillion_larvae',
        name: 'Larvae Universal',
        description: 'Produce 10 quadrillion larvae.',
        isUnlocked: false,
        unlockCondition: () => useAchievementStore().totals.larvae >= 10_000_000_000_000_000,
        progress: () => useAchievementStore().totals.larvae / 10_000_000_000_000_000,
      },

      // Enemy Kill Achievements
      {
        id: 'defeat_10_enemies',
        name: 'Bug Hunter',
        description: 'Defeat 10 enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 10,
        progress: () => useAdventureStore().enemyKillCount / 10,
      },
      {
        id: 'defeat_100_enemies',
        name: 'Bug Slayer',
        description: 'Defeat 100 enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 100,
        progress: () => useAdventureStore().enemyKillCount / 100,
      },
      {
        id: 'defeat_1000_enemies',
        name: 'Bug Exterminator',
        description: 'Defeat 1,000 enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 1000,
        progress: () => useAdventureStore().enemyKillCount / 1000,
        reward: {
          description: 'Ants are now 10% stronger.',
          isClaimed: false,
          onClaim: () => {
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 0.1
            adventureStore.armyDefenseModifier += 0.1
            adventureStore.armyMaxHealthModifier += 0.1
            adventureStore.armyRegenModifier += 0.1
          },
        },
      },
      {
        id: 'defeat_10000_enemies',
        name: 'Insect Annihilator',
        description: 'Defeat 10,000 enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 10000,
        progress: () => useAdventureStore().enemyKillCount / 10000,
      },
      {
        id: 'defeat_100000_enemies',
        name: 'Insect Overlord',
        description: 'Defeat 100,000 enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 100000,
        progress: () => useAdventureStore().enemyKillCount / 100000,
        reward: {
          description: 'Ants are now 15% stronger.',
          isClaimed: false,
          onClaim: () => {
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 0.15
            adventureStore.armyDefenseModifier += 0.15
            adventureStore.armyMaxHealthModifier += 0.15
            adventureStore.armyRegenModifier += 0.15
          },
        },
      },
      {
        id: 'defeat_1_million_enemies',
        name: 'Insect Master',
        description: 'Defeat 1 million enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 1_000_000,
        progress: () => useAdventureStore().enemyKillCount / 1_000_000,
        reward: {
          description: 'Ants are now 100% stronger.',
          isClaimed: false,
          onClaim: () => {
            const adventureStore = useAdventureStore()
            adventureStore.armyAttackModifier += 1
            adventureStore.armyDefenseModifier += 1
            adventureStore.armyMaxHealthModifier += 1
            adventureStore.armyRegenModifier += 1
          },
        },
      },
      {
        id: 'defeat_10_million_enemies',
        name: 'Beast Hunter',
        description: 'Defeat 10 million enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 10_000_000,
        progress: () => useAdventureStore().enemyKillCount / 10_000_000,
      },
      {
        id: 'defeat_100_million_enemies',
        name: 'Beast Slayer',
        description: 'Defeat 100 million enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 100_000_000,
        progress: () => useAdventureStore().enemyKillCount / 100_000_000,
      },
      {
        id: 'defeat_1_billion_enemies',
        name: 'Monster Exterminator',
        description: 'Defeat 1 billion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 1_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 1_000_000_000,
      },
      {
        id: 'defeat_10_billion_enemies',
        name: 'Beast Lord',
        description: 'Defeat 10 billion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 10_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 10_000_000_000,
      },
      {
        id: 'defeat_100_billion_enemies',
        name: 'Beast God',
        description: 'Defeat 100 billion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 100_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 100_000_000_000,
      },
      {
        id: 'defeat_1_trillion_enemies',
        name: 'Beast Emperor',
        description: 'Defeat 1 trillion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 1_000_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 1_000_000_000_000,
      },
      {
        id: 'defeat_10_trillion_enemies',
        name: 'Beast Supreme',
        description: 'Defeat 10 trillion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 10_000_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 10_000_000_000_000,
      },
      {
        id: 'defeat_100_trillion_enemies',
        name: 'Beast Eternal',
        description: 'Defeat 100 trillion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 100_000_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 100_000_000_000_000,
      },
      {
        id: 'defeat_1_quadrillion_enemies',
        name: 'Beast Infinite',
        description: 'Defeat 1 quadrillion enemies in adventure mode.',
        isUnlocked: false,
        unlockCondition: () => useAdventureStore().enemyKillCount >= 1_000_000_000_000_000,
        progress: () => useAdventureStore().enemyKillCount / 1_000_000_000_000_000,
      },

      // Prestige Achievements
      {
        id: 'prestige_once',
        name: 'First Prestige',
        description: 'Prestige for the first time. Don’t worry, it’s just the beginning.',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 1,
        progress: () => usePrestigeStore().timesPrestiged / 1,
      },
      {
        id: 'prestige_10_times',
        name: 'Prestige Enthusiast',
        description: 'Prestige 10 times. You’re starting to get the hang of this!',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 10,
        progress: () => usePrestigeStore().timesPrestiged / 10,
        reward: {
          description: 'Prestige now grans 10% more mutagen',
          isClaimed: false,
          onClaim: () => {
            usePrestigeStore().prestigeMultiplierNumber += 0.1
          },
        },
      },
      {
        id: 'prestige_50_times',
        name: 'Prestige Expert',
        description: 'Prestige 50 times. At this point, are you even playing the game?',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 50,
        progress: () => usePrestigeStore().timesPrestiged / 50,
      },
      {
        id: 'prestige_100_times',
        name: 'Prestige Master',
        description: 'Prestige 100 times. You should probably take a break, but why stop now?',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 100,
        progress: () => usePrestigeStore().timesPrestiged / 100,
        reward: {
          description: 'Prestige now grans 50% more mutagen',
          isClaimed: false,
          onClaim: () => {
            usePrestigeStore().prestigeMultiplierNumber += 0.5
          },
        },
      },
      {
        id: 'prestige_500_times',
        name: 'Prestige Overlord',
        description: 'Prestige 500 times. At this rate, you might prestige in your sleep!',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 500,
        progress: () => usePrestigeStore().timesPrestiged / 500,
      },
      {
        id: 'prestige_1000_times',
        name: 'Prestige Lord',
        description: 'Prestige 1,000 times. Is this a hobby, or are you training for a prestige marathon?',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 1_000,
        progress: () => usePrestigeStore().timesPrestiged / 1_000,
      },
      {
        id: 'prestige_5000_times',
        name: 'Prestige King',
        description: 'Prestige 5,000 times. You’re probably seeing the word "prestige" in your dreams now.',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 5_000,
        progress: () => usePrestigeStore().timesPrestiged / 5_000,
      },
      {
        id: 'prestige_10_000_times',
        name: 'Prestige Emperor',
        description: 'Prestige 10,000 times. Somewhere, the ant queen is impressed.',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 10_000,
        progress: () => usePrestigeStore().timesPrestiged / 10_000,
      },
      {
        id: 'prestige_50_000_times',
        name: 'Prestige God',
        description: 'Prestige 50,000 times. At this point, you might as well rewrite the game’s code.',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 50_000,
        progress: () => usePrestigeStore().timesPrestiged / 50_000,
      },
      {
        id: 'prestige_100_000_times',
        name: 'Prestige Infinite',
        description: 'Prestige 100,000 times. Congratulations, you’ve prestiged more times than stars in the sky (maybe).',
        isUnlocked: false,
        unlockCondition: () => usePrestigeStore().timesPrestiged >= 100_000,
        progress: () => usePrestigeStore().timesPrestiged / 100_000,
      },
    ] as Achievement[],

    rewards: [] as AchievementReward[],
  }),
  getters: {
  },
  actions: {
    claimReward(reward: AchievementReward) {
      reward.isClaimed = true
      reward.onClaim()
      this.rewards.push(reward)
    },
    addToTotal(type: string, amount: BigNumber) {
      if (!this.totals[type]) {
        this.totals[type] = new BigNumber(0)
      }

      this.totals[type] = this.totals[type].plus(amount)
    },
    checkAchievements() {
      const settingsStore = useSettingsStore()
      this.achievements.forEach((achievement) => {
        if (!achievement.isUnlocked && achievement.unlockCondition()) {
          achievement.isUnlocked = true
          if (settingsStore.getNotificationSetting('achievements')) {
            toast.info(`Achievement Unlocked: ${achievement.name}`, {
              duration: 3000,
              position: 'top-right',
            })
          }

          if (achievement.reward && !achievement.reward.isClaimed) {
            this.claimReward(achievement.reward)
          }
        }
      })
    },
    getAchievementState() {
      return {
        totals: this.totals,
        achievements: this.achievements.map(achievement => ({
          id: achievement.id,
          isUnlocked: achievement.isUnlocked,
        })).filter(achievement => achievement.isUnlocked),
      }
    },
    loadAchievementState(state) {
      const achievementModifiers = useResourcesStore().achievementModifiers
      
      // Reset all achievement modifiers to 1
      Object.keys(achievementModifiers).forEach((category) => {
        Object.keys(achievementModifiers[category]).forEach((modifier) => {
          achievementModifiers[category][modifier] = 1
        })
      })

      this.achievements.forEach((achievement) => {
        const savedAchievement = state?.achievements?.find((saved) => saved.id === achievement.id)
        if (savedAchievement) {
          achievement.isUnlocked = savedAchievement.isUnlocked
        }
      })

      this.achievements.forEach((achievement) => {
        if (achievement.isUnlocked) {
          if (achievement.reward) {
            this.claimReward(achievement.reward)
          }
        }
      })

      if (!state.totals) {
        return
      }

      Object.keys(state.totals).forEach((key) => {
        if (!this.totals[key]) {
          this.totals[key] = new BigNumber(0)
        }

        this.totals[key] = new BigNumber(state.totals[key])
      })
    },
    resetAchievements() {
      this.totals = {
        seeds: new BigNumber(0),
        ants: new BigNumber(0),
        queens: new BigNumber(0),
        larvae: new BigNumber(0),
        enemyKills: new BigNumber(0),
        timesPrestiged: new BigNumber(0),
      }

      this.achievements.forEach((achievement) => {
        achievement.isUnlocked = false
      })
    },
  },
})
