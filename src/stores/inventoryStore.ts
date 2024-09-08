import {defineStore} from 'pinia'
import {itemRegistry} from '../types/itemRegistry'
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {useGameStore} from './gameStore' // Import your item registry

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

          this.sortInventory()
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

    sortInventory() {
      const sortBy = [
        'consumable',
        'buff',
        'passive',
      ]

      this.inventory.sort((a, b) => sortBy.indexOf(a.type) - sortBy.indexOf(b.type))
    },

    // Save inventory state to Firebase Firestore
    async saveInventoryState() {
      const userId = await useGameStore().getUserId()
      if (!userId) {
        console.error('User ID not found')
        return
      }

      const inventoryToSave = {
        inventory: this.inventory.map(item => ({
          id: item.id,
          amount: item.amount,
        })),
        maxInventory: this.maxInventory,

        lastSavedTime: Date.now(),
        userId: userId,
      }

      try {
        const gameStore = useGameStore() // Access the gameStore
        const userId = await gameStore.getUserId() // Use gameStore's getUserId method
        if (!userId) {
          console.error('User ID not found')
          return
        }

        await setDoc(doc(db, 'inventory', userId), inventoryToSave).then(() => {
          console.log('Inventory saved to Firestore')
        }).catch((error) => {
          console.error('Error saving inventory to Firestore:', error)
        })
      } catch (error) {
        console.error('Error saving inventory to Firebase:', error)
      }
    },

    // Load inventory state from IndexedDB and reapply effects
    // Load inventory state from Firebase Firestore and reapply effects
    async loadInventoryState() {
      try {
        const gameStore = useGameStore() // Access the gameStore
        const userId = await gameStore.getUserId() // Use gameStore's getUserId method
        if (!userId) {
          console.error('User ID not found')
          return
        }

        const docRef = doc(db, 'inventory', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const savedInventory = docSnap.data()

          this.inventory = savedInventory.inventory.map(item => {
            const registryItem = itemRegistry[item.id]
            if (registryItem) {
              if (registryItem.type === 'passive') {
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
        } else {
          console.log('No inventory found in Firestore')
        }
      } catch (error) {
        console.error('Error loading inventory from Firestore:', error)
      }
    },

    // Reset inventory state and clear from Firebase Firestore
    async resetInventoryState() {
      try {
        const gameStore = useGameStore() // Access the gameStore
        const userId = await gameStore.getUserId() // Use gameStore's getUserId method
        if (!userId) {
          console.error('User ID not found')
          return
        }

        // Clear the user's inventory state from Firestore
        const docRef = doc(db, 'inventory', userId)
        await deleteDoc(docRef) // Delete the document from Firestore

        // Reset the local inventory state
        this.inventory = []
        this.maxInventory = 120 // Reset to default value

        console.log('Inventory reset and cleared from Firestore')
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


