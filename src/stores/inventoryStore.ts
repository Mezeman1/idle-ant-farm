import {defineStore} from 'pinia'

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [],
    maxInventory: 120,
  }),
  actions: {
    loadInventoryState() {
      const inventory = localStorage.getItem('inventory')
      if (inventory) {
        const parsedInventory = JSON.parse(inventory)

        this.inventory = parsedInventory.inventory ?? this.inventory
        this.maxInventory = parsedInventory.maxInventory ?? this.maxInventory
      }
    },
    saveInventoryState() {
      const inventoryState = {
        inventory: this.inventory,
        maxInventory: this.maxInventory,
      }

      localStorage.setItem('inventory', JSON.stringify(inventoryState))
    },
    resetInventoryState() {
      localStorage.removeItem('inventory')
      this.inventory = []
      this.maxInventory = 120
    },
    addItemToInventory(item) {
      const existingItem = this.inventory.find(invItem => invItem.id === item.id)

      if (existingItem) {
        // If the item already exists, increase the amount
        existingItem.amount += item.amount
      } else if (this.inventory.length < this.maxInventory) {
        // If the item does not exist and there's space in the inventory, add it
        this.inventory.push({
          ...item, // Copy the item data
          amount: item.amount, // Ensure we have an amount property
        })
      } else {
        console.log('No space left in the inventory.')
      }

      console.log(this.inventory) // Debugging log to check the inventory
      this.saveInventoryState() // Save the inventory state
    },

  },
})

