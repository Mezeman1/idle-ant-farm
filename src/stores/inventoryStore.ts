import {defineStore} from 'pinia'
import {Item, itemRegistry} from '../types/itemRegistry'
import {deleteDoc, doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {useGameStore} from './gameStore' // Import your item registry

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [],
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

          return true
        }

        return false
      }

      return false
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


