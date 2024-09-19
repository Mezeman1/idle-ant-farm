import {defineStore} from 'pinia'
import {Item, itemRegistry} from '../types/itemRegistry'
import {useAdventureStore} from '@/stores/adventureStore'
import {v4 as uuidv4} from 'uuid'
import {useEquipmentStore} from '@/stores/equipmentStore'

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [] as Array<Item>,
    maxInventory: 20,
    appliedPassiveEffects: [] as Array<string>,
  }),

  actions: {
    // inventoryStore.ts
    async addItemToInventory(itemData: Partial<Item>) {
      const equipmentStore = useEquipmentStore()

      const registryItem = this.getItemById(itemData.id)
      if (!registryItem) {
        console.error(`Item ${itemData.id} not found in registry`)
        return false
      }

      // Handle equipment items
      if (registryItem.type === 'equipment') {
        const equippedItem = equipmentStore.findEquippedItemById(registryItem.id)
        if (equippedItem) {
          // Level up equipped item
          if (equippedItem.level < equippedItem.maxLevel) {
            equipmentStore.levelUpEquippedItem(equippedItem)
            return true
          }
          return false // Early return
        }

        const inventoryItem = this.findEquipmentItemById(registryItem.id)
        if (inventoryItem) {
          // Level up inventory item
          if (inventoryItem.level < inventoryItem.maxLevel) {
            this.levelUpInventoryItem(inventoryItem)
            return true
          }
          return false // Early return
        }

        // Add new equipment item to inventory with amount: 1
        const newItem: Item = {
          ...registryItem,
          amount: 1, // Ensure amount is set to 1
          level: registryItem.level || 1,
          maxLevel: registryItem.maxLevel || 5,
          // Include other necessary properties
        }
        this.inventory.push(newItem)
        this.sortInventory()
        return true // Early return
      }

      // Handle non-equipment items (stackable)
      const existingItem = this.inventory.find((i) => i.id === itemData.id)
      if (existingItem) {
        existingItem.amount += itemData.amount || 1
        this.sortInventory()
        return true // Early return
      }

      // Add new non-equipment item
      const newItem: Item = {
        ...registryItem,
        amount: itemData.amount || 1,
        // Include other necessary properties
      }
      this.inventory.push(newItem)
      this.sortInventory()
      return true
    },

    findEquipmentItemById(itemId: string): Item | null {
      return this.inventory.find(
        (item) => item.id === itemId && item.type === 'equipment',
      ) || null
    },

    levelUpInventoryItem(item: Item) {
      if (item.level >= item.maxLevel) {
        return // Early return
      }
      item.level += 1
    },

    // Removes item from the inventory, decreasing amount or removing it
    async removeItemFromInventory(itemId: string, amount = 1) {
      const item = this.inventory.find(i => i.id === itemId)

      if (item) {
        item.amount -= amount // Decrease amount

        if (item.amount <= 0) {
          this.inventory = this.inventory.filter(i => i.id !== itemId) // Remove if amount is 0
        }

        if (item.type === 'equipment') {
          this.inventory = this.inventory.filter(i => i.id !== itemId) // Remove if equipment
        }

        this.sortInventory() // Sort inventory after removing item
        return true // Return true if successfully removed
      }

      return false // Return false if item not found
    },

    // Apply the effect of an item (passive or buffs)
    applyItemEffect(item, amount = 1) {
      const adventureStore = useAdventureStore()

      if (this.appliedPassiveEffects.includes(item.id) && item.type === 'passive') {
        return false // Effect already applied
      }

      if (item.effect) {
        for (let i = 0; i < amount; i++) {
          if (item.duration) {
            adventureStore.activeBuffs.push({
              id: uuidv4(),
              name: item.id,
              duration: item.duration,
              effect: item.effect,
              onRemove: item.onRemove,
            })
          } else {
            const result = item.effect() // Apply the effect multiple times based on the amount
            if (!result) return false // Stop if the effect fails
          }
        }

        if (item.type === 'passive') {
          this.appliedPassiveEffects.push(item.id)
        }

        return true // All effects applied successfully
      }

      return false // No effect or unsupported item type
    },

    useItem(itemId, amount = 1) {
      const item = this.inventory.find(i => i.id === itemId)

      if (item && item.amount > 0) {
        if (item.type === 'passive') {
          return false // Passive items can't be used
        }

        // Ensure the amount to use doesn't exceed the available amount
        const useAmount = Math.min(item.amount, amount)

        // Apply the item's effect
        if (this.applyItemEffect(item, useAmount)) {
          // Reduce the item's amount by the useAmount
          if (item.type === 'consumable' || item.type === 'buff') {
            item.amount -= useAmount
          }

          // If the item's amount reaches 0, remove it from the inventory
          if (item.amount <= 0) {
            this.inventory = this.inventory.filter(i => i.id !== itemId)
          }

          return true // Item used successfully
        }

        return false // Effect couldn't be applied
      }

      return false // Item not found or no amount left
    },


    sortInventory() {
      const sortByRarity = [
        'common',
        'uncommon',
        'rare',
        'epic',
        'legendary',
      ]

      this.inventory.sort((a, b) => {
        if (a.rarity === b.rarity) {
          return a.name.localeCompare(b.name)
        }

        return sortByRarity.indexOf(a.rarity) - sortByRarity.indexOf(b.rarity)
      })
    },
    getInventoryState() {
      return {
        inventory: this.inventory.map(item => ({
            id: item.id,
            name: item.name,
            level: item.level ?? 1,     // Default to level 1 if undefined
            maxLevel: item.maxLevel ?? 1, // Default to maxLevel 1 if undefined
            amount: item.amount ?? 1,   // Default to amount 1 if undefined
          }),
        ),
        maxInventory: this.maxInventory,
      }
    },
    async loadInventoryState(savedInventory) {
      this.inventory = savedInventory.inventory.map(item => {
        const registryItem = this.getItemById(item.id)
        if (registryItem) {
          if (registryItem.type === 'passive' && registryItem.applyOnLoad) {
            this.applyItemEffect(registryItem) // Reapply the item's effect
          }

          return {
            ...registryItem,
            amount: item.amount,
            level: item.level ?? 1,
            maxLevel: item.maxLevel ?? 5,
          }
        } else {
          console.error(`Item ${item.id} not found in registry`)
          return null
        }
      }).filter(item => item !== null) ?? []

      this.sortInventory()
      this.maxInventory = savedInventory.maxInventory ?? this.maxInventory
      console.log('Inventory loaded from Firestore')
    },

    reApplyPassiveEffects() {
      this.inventory.forEach(item => {
        const registryItem = this.getItemById(item.id)
        if (registryItem && registryItem.type === 'passive' && registryItem.applyOnLoad) {
          this.applyItemEffect(registryItem)
        }
      })
    },

    // Reset inventory state and clear from Firebase Firestore
    async resetInventoryState() {
      this.inventory = []
      this.maxInventory = 20
    },

    getItemById(itemId: string): Item | null {
      return itemRegistry.find(item => item.id === itemId) ?? null
    },

    applyPassiveEffects() {
      this.inventory.forEach(item => {
        const registryItem = this.getItemById(item.id)
        if (registryItem && registryItem.type === 'passive' && registryItem.applyOnPrestige) {
          this.applyItemEffect(registryItem)
        }
      })
    },
  },
})


