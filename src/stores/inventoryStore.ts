import {defineStore} from 'pinia'

import {itemRegistry} from '../types/itemRegistry' // Import your item registry

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [],
    maxInventory: 20,
  }),

  actions: {
    addItemToInventory(item) {
      const existingItem = this.inventory.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.amount += item.amount // Increment if the item already exists
      } else {
        // Link item to itemRegistry and add to inventory
        const registryItem = itemRegistry[item.id]
        if (registryItem) {
          this.inventory.push({...registryItem, amount: item.amount})
          this.applyItemEffect(registryItem)
        } else {
          console.error(`Item ${item.id} not found in registry`)
        }
      }

      this.saveInventoryState() // Save after modifying inventory
    },

    // Load inventory state and reapply effects
    loadInventoryState() {
      const savedInventory = localStorage.getItem('inventory')
      if (savedInventory) {
        const parsedInventory = JSON.parse(savedInventory)
        this.inventory = parsedInventory.inventory.map(item => {
          const registryItem = itemRegistry[item.id]
          if (registryItem) {
            this.applyItemEffect(registryItem) // Reapply the item's effect if needed
            return {...registryItem, amount: item.amount}
          } else {
            console.error(`Item ${item.id} not found in registry`)
            return item // If not found in registry, still load the raw item
          }
        }) ?? []
      }
    },

    // Apply the effect of an item (passive or buffs)
    applyItemEffect(item) {
      if (item.effect) {
        return item.effect() // Apply passive or buff effects
      }

      return false
    },

    // Save inventory state to local storage
    saveInventoryState() {
      const inventoryToSave = {
        inventory: this.inventory.map(item => ({
          id: item.id,
          amount: item.amount,
        })),

        maxInventory: this.maxInventory,
      }
      localStorage.setItem('inventory', JSON.stringify(inventoryToSave))
    },

    useItem(itemId) {
      const item = this.inventory.find(i => i.id === itemId)
      console.log('Using item', item)
      if (item && item.amount > 0) {
        if (item.amount === 0) this.inventory = this.inventory.filter(i => i.id !== itemId)
        // Apply the item's effect
        if (this.applyItemEffect(item)) {
          item.amount -= 1
          this.saveInventoryState() // Save after using an item

          return true
        }

        return false
      }
    },

    // Reset inventory state
    resetInventoryState() {
      this.inventory = []
      localStorage.removeItem('inventory')
    },

    getItemById(itemId) {
      const registryItem = itemRegistry[itemId] ?? null
      if (registryItem) {
        return registryItem
      }
    },
  },
})


