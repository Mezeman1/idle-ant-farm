import {defineStore} from 'pinia'
import {Item} from './itemRegistry'
import {useInventoryStore} from '@/stores/inventoryStore'
import {useGameStore} from '@/stores/gameStore'
import {useAdventureStore} from '@/stores/adventureStore'
import {equipmentSets, setBonuses, SetName} from '@/types/itemRegistry'
import {useResourcesStore} from '@/stores/resourcesStore'

interface EquipmentState {
  equippedItems: {
    head: Item | null;
    body: Item | null;
    legs: Item | null;
    weapon: Item | null;
    accessories: (Item | null)[]; // Plural form, matching the state structure
  };
  activeSetBonus: SetName | null;
}


type SlotType = 'head' | 'body' | 'legs' | 'weapon' | 'accessory'

export const useEquipmentStore = defineStore('equipmentStore', {
  state: (): EquipmentState => ({
    equippedItems: {
      head: null,
      body: null,
      legs: null,
      weapon: null,
      accessories: [null, null] as (Item | null)[],
    },
    activeSetBonus: null,
  }),
  actions: {
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
      const gameStore = useResourcesStore()
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

      adventureStore.setupAdventureStats()
    },
    async equipItem(item: Item, slotType: SlotType, index?: number) {
      const inventoryStore = useInventoryStore()
      const gameStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore }

      // Remove the item from the inventory
      await inventoryStore.removeItemFromInventory(item.id)

      if (slotType === 'accessory' && index !== undefined) {
        if (this.equippedItems.accessories[index]) {
          // Unequip the current accessory
          await this.unequipItem('accessory', index)
        }
      } else {
        if (this.equippedItems[slotType]) {
          // Unequip the current item
          await this.unequipItem(slotType)
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

      adventureStore.setupAdventureStats()

      // Check for set bonuses
      this.checkForSetBonus()

      return true
    },

    async unequipItem(slotType: string, index?: number) {
      const inventoryStore = useInventoryStore()
      const gameStore = useResourcesStore()
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
        await inventoryStore.addItemToInventory(item)
      }

      // Check for set bonuses
      this.checkForSetBonus()
      adventureStore.setupAdventureStats()
    },

    checkForSetBonus() {
      const equippedSetItems: SetName[] = [] // Ensure the array is typed with SetName
      const allEquippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ] as Item[]

      allEquippedItems.forEach((item) => {
        if (item && item.set && setBonuses[item.set as SetName]) {
          equippedSetItems.push(item.set as SetName) // Cast to SetName to maintain type safety
        }
      })

      // Count occurrences of each set
      const setCounts = equippedSetItems.reduce((acc: Record<SetName, number>, setName: SetName) => {
        acc[setName] = (acc[setName] || 0) + 1
        return acc
      }, {} as Record<SetName, number>)

      // Check for full sets
      let fullSetFound = false
      for (const [setName, count] of Object.entries(setCounts)) {
        const typedSetName = setName as SetName // Cast to SetName
        const setSize = this.getSetSize(typedSetName)
        if (count === setSize) {
          // Full set equipped
          if (this.activeSetBonus !== typedSetName) {
            this.applySetBonus(typedSetName)
          }
          fullSetFound = true
          break
        }
      }

      if (!fullSetFound && this.activeSetBonus) {
        this.removeSetBonus()
      }
    },

    getSetSize(setName: string): number {
      return equipmentSets.filter(item => item.set === setName).length || 0
    },

    getEquipedSetSize(setName: string): number {
      const equippedSetItems: SetName[] = []
      const allEquippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ] as Item[]

      allEquippedItems.forEach((item) => {
        if (item && item.set && setBonuses[item.set as SetName]) {
          equippedSetItems.push(item.set as SetName)
        }
      })

      return equippedSetItems.filter(set => set === setName).length
    },

    applySetBonus(setName: SetName) {
      if (this.activeSetBonus) {
        this.removeSetBonus() // Automatically remove the currently active bonus before applying the new one
      }

      if (setBonuses[setName]) {
        setBonuses[setName].apply()
        this.activeSetBonus = setName
      } else {
        console.warn(`Unknown set bonus: ${setName}`)
      }
    },

    removeSetBonus() {
      if (this.activeSetBonus) {
        const setBonus = setBonuses[this.activeSetBonus as SetName]
        if (setBonus) {
          setBonus.remove()
          this.activeSetBonus = null
        } else {
          console.warn(`No active set bonus to remove or unknown set bonus: ${this.activeSetBonus}`)
        }
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
      const gameStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const context = { gameStore, adventureStore }

      if (!state.equippedItems) {
        return
      }

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

      // Add this line to recalculate adventure stats after loading equipment
      useGameStore().setupAdventureStats()
    },
  },
})
