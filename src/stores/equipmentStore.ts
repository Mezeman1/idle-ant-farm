import { defineStore } from 'pinia'
import { Item } from './itemRegistry'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useGameStore } from '@/stores/gameStore'
import { useAdventureStore } from '@/stores/adventureStore'

interface EquipmentState {
  equippedItems: {
    head: Item | null;
    body: Item | null;
    legs: Item | null;
    weapon: Item | null;
    accessories: (Item | null)[];
  };
  activeSetBonus: string | null;
}

export const useEquipmentStore = defineStore('equipmentStore', {
  state: (): EquipmentState => ({
    equippedItems: {
      head: null,
      body: null,
      legs: null,
      weapon: null,
      accessories: Array(2).fill(null),
    },
    activeSetBonus: null,
  }),
  actions: {
    isItemEquipped(itemId) {
      const equippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ]
      return equippedItems.some(item => item && item.id === itemId)
    },
    findEquippedItemById(itemId: string): Item | null {
      const equippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ]
      return equippedItems.find((item) => item && item.id === itemId) || null
    },
    levelUpEquippedItem(item: Item) {
      if (item.level >= item.maxLevel) {
        console.log(`${item.name} is already at max level.`)
        return // Early return
      }
      // Remove old effect
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore }
      if (item.onRemove) {
        item.onRemove(context, item)
      }
      // Level up
      item.level += 1
      // Apply new effect
      if (item.effect) {
        item.effect(context, item)
      }
      console.log(`${item.name} has leveled up to level ${item.level}!`)
    },
    equipItem(item: Item, slotType: string, index?: number): boolean {
      const inventoryStore = useInventoryStore()
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore }

      // Remove the item from the inventory
      inventoryStore.removeItemFromInventory(item.id)

      if (slotType === 'accessory' && index !== undefined) {
        if (this.equippedItems.accessories[index]) {
          // Unequip the current accessory
          this.unequipItem('accessory', index)
        }
      } else {
        if (this.equippedItems[slotType]) {
          // Unequip the current item
          this.unequipItem(slotType)
        }
      }

      // Equip the item
      if (slotType === 'accessory' && index !== undefined) {
        this.equippedItems.accessories[index] = item
      } else {
        this.equippedItems[slotType] = item
      }

      // Apply the item's effect
      if (item.effect) {
        item.effect(context, item)
      }

      // Check for set bonuses
      this.checkForSetBonus()

      return true
    },

    unequipItem(slotType: string, index?: number) {
      const inventoryStore = useInventoryStore()
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore }
      let item: Item | null = null

      // Unequip the item
      if (slotType === 'accessory' && index !== undefined) {
        item = this.equippedItems.accessories[index]
        this.equippedItems.accessories[index] = null
      } else {
        item = this.equippedItems[slotType]
        this.equippedItems[slotType] = null
      }

      // Remove the item's effect
      if (item && item.onRemove) {
        item.onRemove(context, item)
      }

      // Add the item back to the inventory
      if (item) {
        inventoryStore.addItemToInventory(item)
      }

      // Check for set bonuses
      this.checkForSetBonus()
    },

    checkForSetBonus() {
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()

      const equippedSetItems = []
      const allEquippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ]

      allEquippedItems.forEach((item) => {
        if (item && item.set) {
          equippedSetItems.push(item.set)
        }
      })

      // Count occurrences of each set
      const setCounts = equippedSetItems.reduce((acc, setName) => {
        acc[setName] = (acc[setName] || 0) + 1
        return acc
      }, {})

      // Check for full sets
      let fullSetFound = false
      for (const [setName, count] of Object.entries(setCounts)) {
        const setSize = this.getSetSize(setName)
        if (count === setSize) {
          // Full set equipped
          if (this.activeSetBonus !== setName) {
            this.applySetBonus(setName)
          }
          fullSetFound = true
          break
        }
      }

      if (!fullSetFound && this.activeSetBonus) {
        this.removeSetBonus()
      }
    },

    getSetSize(setName) {
      // Define the size of each set
      const setSizes = {
        'Worker Set': 4,
        'Soldier Set': 5,
        'Royal Set': 5,
      }
      return setSizes[setName] || 0
    },

    applySetBonus(setName) {
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()

      this.activeSetBonus = setName

      switch (setName) {
        case 'Worker Set':
          // Increase resource gathering by an additional 15%
          gameStore.productionRates.collectionRateModifier *= 1.15
          console.log(`Applied ${setName} bonus`)
          break
        case 'Soldier Set':
          // Increase army attack and defense by an additional 15%
          adventureStore.armyAttackModifier *= 1.15
          adventureStore.armyDefenseModifier *= 1.15
          console.log(`Applied ${setName} bonus`)
          break
        case 'Royal Set':
          // Increase larvae production rate by an additional 20%
          gameStore.productionRates.larvaeProductionRate *= 1.20
          console.log(`Applied ${setName} bonus`)
          break
        default:
          console.warn(`Unknown set bonus: ${setName}`)
      }
    },

    removeSetBonus() {
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()

      if (this.activeSetBonus) {
        switch (this.activeSetBonus) {
          case 'Worker Set':
            // Reverse the additional 15% increase
            gameStore.productionRates.collectionRateModifier /= 1.15
            console.log(`Removed ${this.activeSetBonus} bonus`)
            break
          case 'Soldier Set':
            // Reverse the additional 15% increase
            adventureStore.armyAttackModifier /= 1.15
            adventureStore.armyDefenseModifier /= 1.15
            console.log(`Removed ${this.activeSetBonus} bonus`)
            break
          case 'Royal Set':
            // Reverse the additional 20% increase
            gameStore.productionRates.larvaeProductionRate /= 1.20
            console.log(`Removed ${this.activeSetBonus} bonus`)
            break
          default:
            console.warn(`Unknown set bonus: ${this.activeSetBonus}`)
        }
        this.activeSetBonus = null
      }
    },

    getEquipmentState() {
      const equipmentItemsOnlyId = {
        head: this.equippedItems.head ? {
          id: this.equippedItems.head.id,
          level: this.equippedItems.head.level,
        } : null,
        body: this.equippedItems.body ? {
          id: this.equippedItems.body.id,
          level: this.equippedItems.body.level,
        } : null,
        legs: this.equippedItems.legs ? {
          id: this.equippedItems.legs.id,
          level: this.equippedItems.legs.level,
        } : null,
        weapon: this.equippedItems.weapon ? {
          id: this.equippedItems.weapon.id,
          level: this.equippedItems.weapon.level,
        } : null,
        accessories: this.equippedItems.accessories.map((item) => (item ? {
          id: item.id,
          level: item.level,
        } : null)),
      }

      return {
        equippedItems: equipmentItemsOnlyId,
        activeSetBonus: this.activeSetBonus,
      }
    },

    loadEquipmentState(state) {
      const inventoryStore = useInventoryStore()
      const gameStore = useGameStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore };

      // Load equipped items and apply their effects
      ['head', 'body', 'legs', 'weapon'].forEach((slotType) => {
        const itemId = state.equippedItems[slotType]?.id || null

        if (itemId) {
          const item = inventoryStore.getItemById(itemId)
          if (item) {
            this.equippedItems[slotType] = item

            item.level = state.equippedItems[slotType]?.level || 1 // Set level from state

            if (item.effect) {
              item.effect(context, item)
            }
          }
        } else {
          this.equippedItems[slotType] = null
        }
      })

      // Load accessories
      if (Array.isArray(state.equippedItems.accessories)) {
        state.equippedItems.accessories.forEach((accessoryState, index) => {
          const itemId = accessoryState?.id || null
          if (itemId) {
            const item = inventoryStore.getItemById(itemId)
            if (item) {
              this.equippedItems.accessories[index] = item
              item.level = accessoryState?.level || 1 // Set level from state
              if (item.effect) {
                item.effect(context, item)
              }
            }
          } else {
            this.equippedItems.accessories[index] = null
          }
        })
      }

      // Recalculate set bonuses
      this.checkForSetBonus()
    },
  },
})
