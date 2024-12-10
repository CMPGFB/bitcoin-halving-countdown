'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bitcoin, Clock, CoinsIcon as CoinIcon, Timer } from 'lucide-react'
import { fetchBitcoinData, formatTimeRemaining } from '@/lib/bitcoin-utils'

export default function BitcoinDashboard() {
  const [data, setData] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const bitcoinData = await fetchBitcoinData()
      
      if (bitcoinData) {
        setData(bitcoinData)
        setTimeRemaining(formatTimeRemaining(bitcoinData.estimatedSeconds))
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  if (!data || !timeRemaining) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7931A]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7931A] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Bitcoin Halving Countdown</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Time Until Halving</CardTitle>
              <Timer className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
              </div>
              <p className="text-xs text-white/60">
                Blocks remaining: {data.blocksRemaining}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Current Block</CardTitle>
              <Clock className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data.currentBlock}</div>
              <p className="text-xs text-white/60">
                Target: 840,000
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Bitcoin Price</CardTitle>
              <Bitcoin className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${data.price?.toLocaleString()}
              </div>
              <p className="text-xs text-white/60">
                Updated every minute
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Circulating Supply</CardTitle>
              <CoinIcon className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {data.circulatingSupply.toLocaleString(undefined, {maximumFractionDigits: 0})} BTC
              </div>
              <p className="text-xs text-white/60">
                {((data.circulatingSupply / 21000000) * 100).toFixed(2)}% of total supply
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-white/60 mt-8 space-y-2">
          <p>Data provided by mempool.space and blockchain.info</p>
          <p>
            <a 
              href="https://x.com/cmpgfb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              Powered By CMPGFB
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

