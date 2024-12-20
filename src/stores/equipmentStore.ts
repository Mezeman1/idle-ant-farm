import {defineStore} from 'pinia'
import {getMaxItemLevel, Item} from '@/types/items/itemRegistry'
import {useInventoryStore} from '@/stores/inventoryStore'
import {useGameStore} from '@/stores/gameStore'
import {useAdventureStore} from '@/stores/adventureStore'
import {equipmentSets, setBonuses, SetName} from '@/types/items/itemRegistry'
import {useResourcesStore} from '@/stores/resourcesStore'

interface EquipmentState {
  equippedItems: {
    head: Item | null;
    body: Item | null;
    legs: Item | null;
    weapon: Item | null;
    accessories: (Item | null)[]; // Plural form, matching the state structure
  };
  maxAccessories: number;
  activeSetBonus: SetName | null;

  loadOuts: LoadOut[];
  maxLoadOuts: number;

  storageModifiers: {
    larvae: number;
    seeds: number;
    ants: number;
    queen: number;
  };
}

interface LoadOut {
  name: string;
  equippedItems: {
    head: Item | null;
    body: Item | null;
    legs: Item | null;
    weapon: Item | null;
    accessories: (Item | null)[];
  };
}


type SlotType = 'head' | 'body' | 'legs' | 'weapon' | 'accessory'

export const useEquipmentStore = defineStore('equipmentStore', {
  state: (): EquipmentState => ({
    equippedItems: {
      head: null,
      body: null,
      legs: null,
      weapon: null,
      accessories: [] as (Item | null)[],
    },

    maxAccessories: 2,
    activeSetBonus: null,

    loadOuts: [],
    maxLoadOuts: 3,
    storageModifiers: {
      larvae: 1,
      seeds: 1,
      ants: 1,
      queen: 1,
    },
  }),
  getters: {
    getAvailableItemsForSlot: (state) => (slotType: SlotType) => {
      const inventoryStore = useInventoryStore()
      return inventoryStore.equipmentItemsInInventory.filter((item: Item) => item.slotType === slotType)
    },
    getCurrentEquippedItemForSlot: (state) => (slotType: SlotType, index?: number) => {
      if (slotType === 'accessory' && index !== undefined) {
        return state.equippedItems.accessories[index]
      }

      return state.equippedItems[slotType]
    },
    hasItemEquipped: (state) => (itemId: string) => {
      // Check non-accessory slots
      const isEquippedInSlots = Object.values(state.equippedItems)
        .filter(slot => !Array.isArray(slot)) // Filter out the accessories array
        .some(item => item && item.id === itemId)

      // Check accessories array
      const isEquippedInAccessories = state.equippedItems.accessories.some(item => item && item.id === itemId)

      return isEquippedInSlots || isEquippedInAccessories
    },
  },
  actions: {
    maxAllEquipped() {
      // Max all equipped items to the max level
      Object.values(this.equippedItems).flat().forEach((item) => {
        if (item) {
          item.level = getMaxItemLevel(item)
        }
      })
    },
    getItemFromEquipment(itemId: string): Item | null {
      const equippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
        ...this.equippedItems.accessories,
      ]
      return equippedItems.find((item) => item && item.id === itemId) || null
    },
    loadLoadOut(loadOut: LoadOut) {
      const inventoryStore = useInventoryStore()
      // Loop over each key in the equippedItems object from the loadOut
      Object.keys(loadOut.equippedItems).forEach((key) => {
        // If the key is 'accessories', iterate through the array of accessories
        if (key === 'accessories') {
          loadOut.equippedItems.accessories.forEach((accessory, index) => {
            if (!accessory) {
              return
            }

            if (inventoryStore.hasItem(accessory.id)) {
              // If the player has the accessory in their inventory, equip it
              this.equipItem(inventoryStore.getItemById(accessory.id), 'accessory', index)
            }
          })

          return
        }

        if (!loadOut.equippedItems[key]) {
          return
        }

        // If the player has the item in their inventory, equip it
        if (inventoryStore.hasItem(loadOut.equippedItems[key].id)) {
          this.equipItem(inventoryStore.getItemById(loadOut.equippedItems[key].id), key as SlotType)
        }
      })
    },
    saveLoadOut(name: string) {
      if (this.loadOuts.length >= this.maxLoadOuts) {
        return
      }

      const loadOut = {
        name,
        equippedItems: {
          head: this.equippedItems.head,
          body: this.equippedItems.body,
          legs: this.equippedItems.legs,
          weapon: this.equippedItems.weapon,
          accessories: this.equippedItems.accessories,
        },
      }

      this.loadOuts.push(loadOut)
    },
    deleteLoadOut(name: string) {
      const index = this.loadOuts.findIndex((loadOut) => loadOut.name === name)
      if (index !== -1) {
        this.loadOuts.splice(index, 1)
      }
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
      if (item.level >= getMaxItemLevel(item)) {
        return // Early return
      }
      // Remove old effect
      const gameStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const equipmentStore = useEquipmentStore()
      const context = {gameStore, adventureStore, equipmentStore}
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
      const resourcesStore = useResourcesStore()
      const equipmentStore = useEquipmentStore()
      const context = {gameStore, adventureStore, resourcesStore, equipmentStore}
      item = inventoryStore.getItemFromInventory(item.id)

      // Remove the item from the inventory
      if (slotType === 'accessory') {
        if (index === undefined) {
          const firstEmptySlot = this.equippedItems.accessories.findIndex((accessory) => !accessory)
          if (firstEmptySlot !== -1) {
            index = firstEmptySlot
          } else {
            index = Math.random() < 0.5 ? 0 : 1
          }
        }

        if (index >= this.maxAccessories) {
          return false
        }

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
        await inventoryStore.removeItemFromInventory(item.id)
        this.equippedItems.accessories[index] = item
      } else {
        await inventoryStore.removeItemFromInventory(item.id)
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

    async unequipItem(slotType: string, index?: number, equippedItem?:Item ): Item {
      const inventoryStore = useInventoryStore()
      const gameStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const equipmentStore = useEquipmentStore()
      const context = {gameStore, adventureStore, equipmentStore}
      let item: Item | null = null
      // Unequip the item
      if (slotType === 'accessory') {
        if (index === undefined && equippedItem) {
          index = this.equippedItems.accessories.findIndex((accessory) => accessory.id === equippedItem.id)
        }

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

      return item
    },

    async unequipAllItems() {
      const equippedItems = [
        this.equippedItems.head,
        this.equippedItems.body,
        this.equippedItems.legs,
        this.equippedItems.weapon,
      ]

      const equippedAccessories = this.equippedItems.accessories

      // Unequip all items
      equippedItems.forEach((item) => {
        if (item) {
          this.unequipItem(item.slotType)
        }
      })

      equippedAccessories.forEach((item, index) => {
        if (item) {
          this.unequipItem('accessory', index)
        }
      })
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
        loadOuts: this.loadOuts,
        maxLoadOuts: this.maxLoadOuts,
      }
    },

    loadEquipmentState(state) {
      const gameStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const equipmentStore = useEquipmentStore()  
      const context = { gameStore, adventureStore, equipmentStore }

      this.resetState(state)
      if (!state.equippedItems) return

      // Load equipped items for main slots (head, body, legs, weapon)
      this.loadEquippedItems(state.equippedItems, context)

      // Load accessory slots
      this.loadAccessories(state.equippedItems.accessories, context)

      // Recalculate bonuses and stats
      this.finalizeLoading()
    },

    resetState(state) {
      this.activeSetBonus = null
      this.loadOuts = state.loadOuts ?? []
      this.maxLoadOuts = state.maxLoadOuts ?? this.maxLoadOuts
      this.maxAccessories = 2
      this.storageModifiers = {
        larvae: 1,
        seeds: 1,
        ants: 1,
        queen: 1,
      }
    },

    loadEquippedItems(equippedItems, context) {
      const inventoryStore = useInventoryStore()

      // Iterate over the main slots and load items
      const slots = ['head', 'body', 'legs', 'weapon']
      slots.forEach((slotType) => {
        const itemId = equippedItems[slotType]?.id || null
        if (itemId) {
          const item = inventoryStore.getItemById(itemId)
          if (item) {
            this.equippedItems[slotType] = item
            item.level = equippedItems[slotType]?.level || 1
            this.applyItemEffect(item, context)
          }
          return
        }

        this.equippedItems[slotType] = null
      })
    },

    loadAccessories(accessories = [], context) {
      const inventoryStore = useInventoryStore()

      accessories.forEach((accessoryState, index) => {
        const itemId = accessoryState?.id || null
        if (itemId) {
          const item = inventoryStore.getItemById(itemId)
          if (item) {
            this.equippedItems.accessories[index] = item
            item.level = accessoryState?.level || 1
            this.applyItemEffect(item, context)
          }
        } else {
          this.equippedItems.accessories[index] = null
        }
      })
    },

    applyItemEffect(item, context) {
      if (item.effect) {
        item.effect(context, item)
      }
    },

    finalizeLoading() {
      this.checkForSetBonus()
      useGameStore().setupAdventureStats()
    },

    resetEquipmentState() {
      this.equippedItems = {
        head: null,
        body: null,
        legs: null,
        weapon: null,
        accessories: [null, null],
      }

      this.activeSetBonus = null

      this.loadOuts = []

      this.maxLoadOuts = 3

      this.storageModifiers = {
        larvae: 1,
        seeds: 1,
        ants: 1,
        queen: 1,
      }

      // Recalculate set bonuses
      this.checkForSetBonus()

      // Add this line to recalculate adventure stats after resetting equipment
      useGameStore().setupAdventureStats()
    },
  },
})
