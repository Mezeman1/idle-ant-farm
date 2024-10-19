import {defineStore} from 'pinia'
import {getMaxItemLevel, Item, itemRegistry} from '@/types/items/itemRegistry'
import {useAdventureStore} from '@/stores/adventureStore'
import {v4 as uuidv4} from 'uuid'
import {useEquipmentStore} from '@/stores/equipmentStore'
import {useEvolveStore} from '@/stores/evolveStore'

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventory: [] as Array<Item>,
    maxInventory: 20,
    appliedPassiveEffects: [] as Array<string>,
  }),
  getters: {
    passiveItemsInInventory() {
      return this.inventory.filter(item => item.type === 'passive')
    },
    equipmentItemsInInventory() {
      return this.inventory.filter(item => item.type === 'equipment')
    },
  },
  actions: {
    // inventoryStore.ts
    hasItem(itemId: string): boolean {
      const equipmentStore = useEquipmentStore()
      return this.inventory.some(item => item.id === itemId) || equipmentStore.hasItemEquipped(itemId)
    },
    async addItemToInventory(itemData: Partial<Item>) {
      const equipmentStore = useEquipmentStore()

      const registryItem = this.getItemById(itemData.id)
      if (!registryItem) {
        return false
      }

      // Handle equipment items separately
      if (this.isEquipmentItem(registryItem)) {
        return this.handleEquipmentItem(registryItem, itemData, equipmentStore)
      }

      // Handle non-equipment items
      return this.handleNonEquipmentItem(registryItem, itemData)
    },

    isEquipmentItem(item: Item): boolean {
      return item.type === 'equipment'
    },

    handleEquipmentItem(registryItem: Item, itemData: Partial<Item>, equipmentStore) {
      const equippedItem = equipmentStore.findEquippedItemById(registryItem.id)
      if (equippedItem) {
        return this.levelUpIfPossible(equippedItem, equipmentStore.levelUpEquippedItem)
      }

      const inventoryItem = this.findEquipmentItemById(registryItem.id)
      if (inventoryItem) {
        return this.levelUpIfPossible(inventoryItem, this.levelUpInventoryItem)
      }

      // If the equipment item is not found in inventory or equipped, add as a new item
      this.addNewEquipmentItem(registryItem, itemData)
      return true
    },

    levelUpIfPossible(item: Item, levelUpFn: (item: Item) => void): boolean {
      if (item.level < getMaxItemLevel(item)) {
        levelUpFn(item)
        return true
      }
      return false
    },

    addNewEquipmentItem(registryItem: Item, itemData: Partial<Item>) {
      const newItem: Item = {
        ...registryItem,
        amount: 1,
        level: itemData.level || 1,
        maxLevel: getMaxItemLevel(itemData) || 5,
      }
      this.inventory.push(newItem)
      this.sortInventory()
    },

    handleNonEquipmentItem(registryItem: Item, itemData: Partial<Item>): boolean {
      const existingItem = this.inventory.find((i) => i.id === itemData.id)

      if (existingItem) {
        return this.updateExistingItem(existingItem, itemData)
      }

      // Add as a new non-equipment item
      this.addNewNonEquipmentItem(registryItem, itemData)
      return true
    },

    updateExistingItem(existingItem: Item, itemData: Partial<Item>): boolean {
      if (existingItem.type !== 'passive') {
        existingItem.amount += itemData.amount || 1
      }
      this.sortInventory()
      return true
    },

    addNewNonEquipmentItem(registryItem: Item, itemData: Partial<Item>) {
      const newItem: Item = {
        ...registryItem,
        amount: itemData.amount || 1,
      }
      this.inventory.push(newItem)
      this.sortInventory()
    },
    findEquipmentItemById(itemId: string): Item | null {
      return this.inventory.find(
        (item) => item.id === itemId && item.type === 'equipment',
      ) || null
    },

    levelUpInventoryItem(item: Item) {
      if (item.level >= getMaxItemLevel(item)) {
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

      // Make all passive items 1 amount
      this.inventory = this.inventory.map(item => {
        if (item.type === 'passive') {
          item.amount = 1
        }
        return item
      })
    },
    getInventoryState() {
      return {
        inventory: this.inventory.map(item => ({
            id: item.id,
            name: item.name,
            level: item.level ?? 1,     // Default to level 1 if undefined
            maxLevel: getMaxItemLevel(item) ?? 1, // Default to maxLevel 1 if undefined
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
            maxLevel: getMaxItemLevel(item) ?? 5,
          }
        } else {
          return null
        }
      }).filter(item => item !== null) ?? []

      this.sortInventory()
      this.maxInventory = savedInventory.maxInventory ?? this.maxInventory
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
      // itemId could also be name, so let's convery it to lowercase and replace spaces with dashes
      itemId = itemId.toLowerCase().replace(/ /g, '-')

      return itemRegistry.find(item => item.id === itemId) ?? null
    },

    getItemFromInventory(itemId: string): Item | null {
      return this.inventory.find(item => item.id === itemId) ?? null
    },

    applyPassiveEffects() {
      console.log('Applying passive effects')
      this.inventory.forEach(item => {
        const registryItem = this.getItemById(item.id)
        if (registryItem && registryItem.type === 'passive' && registryItem.applyOnPrestige) {
          this.applyItemEffect(registryItem)
        }
      })
    },
  },
})


