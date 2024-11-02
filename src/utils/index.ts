import { useGameStore } from '@/stores/gameStore'
import BigNumber from 'bignumber.js'

const formatTime = (milliseconds: number, hideZeros = false): string => {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  if (hideZeros) {
    return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`
  }

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

const toPercentage = (value?: number | BigNumber, total: number | BigNumber = 1): string => {
  if (value instanceof BigNumber) {
    value = value.toNumber()
  }
  
  if (total instanceof BigNumber) {
    total = total.toNumber()
  }
  
  if (!value) return '0'

  return ((value / total) * 100).toFixed(1)
}
const toPercentageFormatted = (value?: number | BigNumber, total = 1): string => {
  const percentage = toPercentage(value, total)
  return formatNumber(parseFloat(percentage))
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatNumber = (value: number): string => {
  const gameStore = useGameStore()
  return gameStore.formatNumber(value, 0)
}

export { formatTime, toPercentage, toPercentageFormatted, capitalize, formatNumber }
