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

const toPercentage = (value: number, total: number): number => {
  return ((value / total) * 100).toFixed(1)
}

export { formatTime, toPercentage }
