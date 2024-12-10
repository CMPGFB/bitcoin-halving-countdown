export const BLOCKS_UNTIL_HALVING = 840000
export const AVERAGE_BLOCK_TIME = 10 * 60 // 10 minutes in seconds

export async function fetchBitcoinData() {
  try {
    const [blockHeightRes, priceRes, supplyRes] = await Promise.all([
      fetch('https://mempool.space/api/blocks/tip/height'),
      fetch('https://mempool.space/api/v1/prices'),
      fetch('https://blockchain.info/q/totalbc')
    ])
    
    const currentBlock = await blockHeightRes.json()
    const prices = await priceRes.json()
    const supply = await supplyRes.json()
    
    const blocksRemaining = BLOCKS_UNTIL_HALVING - currentBlock
    const estimatedSeconds = blocksRemaining * AVERAGE_BLOCK_TIME
    
    return {
      currentBlock,
      blocksRemaining,
      estimatedSeconds,
      price: prices.USD,
      circulatingSupply: supply / 100000000 // Convert satoshis to BTC
    }
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error)
    return null
  }
}

export function formatTimeRemaining(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  return { days, hours, minutes }
}

