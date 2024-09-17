import {defineStore} from 'pinia'
import {Item, itemRegistry} from '../types/itemRegistry'
import {useAdventureStore} from '@/stores/adventureStore'
import { v4 as uuidv4 } from 'uuid'
export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [] as Array<Item>,
    maxInventory: 20,
  }),

  actions: {
    async addItemToInventory(item) {
      const existingItem = this.inventory.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.amount += item.amount // Increment if the item already exists
      } else {
        const registryItem = this.getItemById(item.id)
        if (registryItem) {
          this.inventory.push({...registryItem, amount: item.amount})
          if (registryItem.type === 'passive') {
            this.applyItemEffect(registryItem)
          }

          this.sortInventory()
        } else {
          console.error(`Item ${item.id} not found in registry`)
        }
      }
    },

    // Removes item from the inventory, decreasing amount or removing it
    async removeItemFromInventory(itemId: string, amount = 1) {
      const item = this.inventory.find(i => i.id === itemId)

      if (item) {
        item.amount -= amount // Decrease amount

        if (item.amount <= 0) {
          this.inventory = this.inventory.filter(i => i.id !== itemId) // Remove if amount is 0
        }

        this.sortInventory() // Sort inventory after removing item
        return true // Return true if successfully removed
      }

      return false // Return false if item not found
    },

    // Apply the effect of an item (passive or buffs)
    applyItemEffect(item, amount = 1) {
      const adventureStore = useAdventureStore()
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
          amount: item.amount,
        })),
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
          return {...registryItem, amount: item.amount}
        } else {
          console.error(`Item ${item.id} not found in registry`)
          return item // Load the raw item if not found in registry
        }
      }) ?? []

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


