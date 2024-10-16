export const workerSet = [
  {
    id: 'worker-helm',
    name: 'Worker Helm',
    type: 'equipment',
    description: 'Head armor for workers, increases resource gathering by 0.1035% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.001035313244622532,
    effect: ({gameStore}, item) => {
      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-body',
    name: 'Worker Chestplate',
    type: 'equipment',
    description: 'Body armor for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.0015529698669337984, // Already done
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-legs',
    name: 'Worker Legs',
    type: 'equipment',
    description: 'Leg armor for workers, increases resource gathering by 0.0776% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.0007758055940675406, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-gloves',
    name: 'Worker Gloves',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1293% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.0012934622163788066, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-pickaxe',
    name: 'Worker Pickaxe',
    type: 'equipment',
    description: 'Weapon for workers, increases resource gathering by 0.2071% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.002070626489245064, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-shield',
    name: 'Worker Shield',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 100,
    multiplier: 0.0015529698669337984, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
]
export const workerSetII = [
  {
    id: 'worker-helm-ii',
    name: 'Worker Helm II',
    type: 'equipment',
    description: 'Head armor for workers, increases resource gathering by 0.1035% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.001035313244622532,
    effect: ({gameStore}, item) => {
      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-body-ii',
    name: 'Worker Chestplate II',
    type: 'equipment',
    description: 'Body armor for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0015529698669337984, // Already done
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-legs-ii',
    name: 'Worker Legs II',
    type: 'equipment',
    description: 'Leg armor for workers, increases resource gathering by 0.0776% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0007758055940675406, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-gloves-ii',
    name: 'Worker Gloves II',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1293% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0012934622163788066, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-pickaxe-ii',
    name: 'Worker Pickaxe II',
    type: 'equipment',
    description: 'Weapon for workers, increases resource gathering by 0.2071% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.002070626489245064, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
  {
    id: 'worker-shield-ii',
    name: 'Worker Shield II',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0015529698669337984, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier += bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier -= bonusMultiplier
    },
  },
]
