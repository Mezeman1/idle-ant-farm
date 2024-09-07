import {defineStore} from 'pinia'
import { set, get, del } from 'idb-keyval'
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
          if (registryItem.type === 'passive') {
            this.applyItemEffect(registryItem)
          }
        } else {
          console.error(`Item ${item.id} not found in registry`)
        }
      }

      this.saveInventoryState() // Save after modifying inventory
    },

    // Apply the effect of an item (passive or buffs)
    applyItemEffect(item) {
      console.log('Applying item effect', item)
      if (item.effect) {
        return item.effect() // Apply passive or buff effects
      }

      return false
    },

    useItem(itemId) {
      const item = this.inventory.find(i => i.id === itemId)
      console.log('Using item', item)
      if (item && item.amount > 0) {
        if (item.amount === 0) this.inventory = this.inventory.filter(i => i.id !== itemId)
        if (item.type === 'passive') {
          return false
        }

        // Apply the item's effect
        if (this.applyItemEffect(item)) {
          if (item.type === 'consumable' || item.type === 'buff') {
            item.amount -= 1
          }

          if (item.amount === 0) {
            this.inventory = this.inventory.filter(i => i.id !== itemId)
          }

          this.saveInventoryState() // Save after using an item

          return true
        }

        return false
      }
    },

    // Save inventory state to IndexedDB
    async saveInventoryState() {
      const inventoryToSave = {
        inventory: this.inventory.map(item => ({
          id: item.id,
          amount: item.amount,
        })),
        maxInventory: this.maxInventory,
      }

      try {
        await set('inventory', inventoryToSave)
        console.log('Inventory saved to IndexedDB')
      } catch (error) {
        console.error('Error saving inventory:', error)
      }
    },

    // Load inventory state from IndexedDB and reapply effects
    async loadInventoryState() {
      try {
        const savedInventory = await get('inventory')
        if (savedInventory) {
          this.inventory = savedInventory.inventory.map(item => {
            const registryItem = itemRegistry[item.id]
            if (registryItem) {
              if (registryItem.type === 'passive') {
                this.applyItemEffect(registryItem) // Reapply the item's effect
              }

              return { ...registryItem, amount: item.amount }
            } else {
              console.error(`Item ${item.id} not found in registry`)
              return item // Load the raw item if not found in registry
            }
          }) ?? []

          this.maxInventory = savedInventory.maxInventory ?? this.maxInventory
          console.log('Inventory loaded from IndexedDB')
        } else {
          console.log('No inventory found in IndexedDB')
        }
      } catch (error) {
        console.error('Error loading inventory:', error)
      }
    },

    // Reset inventory state and clear from IndexedDB
    async resetInventoryState() {
      try {
        await del('inventory')
        this.inventory = []
        this.maxInventory = 120 // Reset to default value or what you'd prefer

        console.log('Inventory reset and cleared from IndexedDB')
      } catch (error) {
        console.error('Error resetting inventory:', error)
      }
    },

    getItemById(itemId) {
      const registryItem = itemRegistry[itemId] ?? null
      if (registryItem) {
        return registryItem
      }
    },
  },
})


