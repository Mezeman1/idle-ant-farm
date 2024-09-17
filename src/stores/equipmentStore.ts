import { defineStore } from 'pinia'
import { Item } from './itemRegistry'
import { useInventoryStore } from '@/stores/inventoryStore'

interface EquipmentState {
  equippedItems: {
    head: Item | null;
    body: Item | null;
    legs: Item | null;
    weapon: Item | null;
    accessories: (Item | null)[];
  };
  activeSetBonus: string | null;
}

export const useEquipmentStore = defineStore('equipmentStore', {
  state: (): EquipmentState => ({
    equippedItems: {
      head: null,
      body: null,
      legs: null,
      weapon: null,
      accessories: Array(2).fill(null),
    },
    activeSetBonus: null,
  }),
  actions: {
    equipItem(
      item: Item,
      slotType: 'head' | 'body' | 'legs' | 'weapon' | 'accessory',
      index?: number,
    ): boolean {
      // Check if the item belongs in the specified slot
      if (item.slotType !== slotType) {
        console.warn(`Cannot equip ${item.name} in the ${slotType} slot`)
        return false
      }

      // Equip item in the correct slot
      if (slotType === 'accessory') {
        if (index !== undefined) {
          this.equippedItems.accessories[index] = item
        }
      } else {
        this.equippedItems[slotType] = item
      }

      this.checkForSetBonus()

      return true
    },
    unequipItem(slotType: 'head' | 'body' | 'legs' | 'weapon' | 'accessory', index?: number) {
      if (slotType === 'accessory' && index !== undefined) {
        this.equippedItems.accessories[index] = null
      } else {
        this.equippedItems[slotType] = null
      }
      this.checkForSetBonus()
    },
    checkForSetBonus() {
      const equippedSet = new Set(
        Object.values(this.equippedItems)
          .flatMap((item) => (Array.isArray(item) ? item : [item]))
          .filter((item): item is Item => item !== null && item.set !== undefined)
          .map((item) => item.set),
      )

      if (equippedSet.size === 1) {
        // All items are from the same set
        this.applySetBonus([...equippedSet][0]!)
      } else {
        this.removeSetBonus()
      }
    },
    applySetBonus(setName: string) {
      this.activeSetBonus = setName

      switch (setName) {
        case 'Worker Set':
          // Example bonus for Worker Set
          break
        case 'Soldier Set':
          // Example bonus for Soldier Set
          break
        case 'Royal Set':
          // Example bonus for Royal Set
          break
        default:
          break
      }
    },
    removeSetBonus() {
      if (this.activeSetBonus) {
        console.log(`Set bonus for ${this.activeSetBonus} removed!`)
        this.activeSetBonus = null
      }
    },

    getEquipmentState() {
      const equipmentItemsOnlyId = {
        head: this.equippedItems.head ? this.equippedItems.head.id : null,
        body: this.equippedItems.body ? this.equippedItems.body.id : null,
        legs: this.equippedItems.legs ? this.equippedItems.legs.id : null,
        weapon: this.equippedItems.weapon ? this.equippedItems.weapon.id : null,
        accessories: this.equippedItems.accessories.map((item) => (item ? item.id : null)),
      }

      return {
        equippedItems: equipmentItemsOnlyId,
        activeSetBonus: this.activeSetBonus,
      }
    },

    loadEquipmentState(state) {
      const inventoryStore = useInventoryStore();

      // Load single equipment slots
      ['head', 'body', 'legs', 'weapon'].forEach((slotType) => {
        const id = state.equippedItems[slotType]
        if (id) {
          const item = inventoryStore.getItemById(id)
          if (item) {
            this.equipItem(item, slotType as 'head' | 'body' | 'legs' | 'weapon')
          }
        }
      })

      // Load accessories
      if (Array.isArray(state.equippedItems.accessories)) {
        state.equippedItems.accessories.forEach((id, index) => {
          if (id) {
            const item = inventoryStore.getItemById(id)
            if (item) {
              this.equipItem(item, 'accessory', index)
            }
          }
        })
      }

      this.activeSetBonus = state.activeSetBonus ?? null
    },
  },
})
