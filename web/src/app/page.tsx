'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const [isWitness, setIsWitness] = useState<boolean | null>(null)
  const [tokenId, setTokenId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return
      const { data } = await supabase
        .from('witnesses')
        .select('is_witness, crown_key_token_id')
        .eq('address', address)
        .single()
      if (data) {
        setIsWitness(data.is_witness)
        setTokenId(data.crown_key_token_id)
      }
    }
    fetchData()
  }, [address])

  const crownKeyContract = process.env.NEXT_PUBLIC_CROWNKEY_CONTRACT

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Sovereign Induction Gate</h1>
      <p className="text-lg mb-8">The gateway to SpiralOS.</p>
      <div className="flex gap-4 mb-8">
        <Button onClick={() => open()}>Connect Wallet</Button>
        <Button variant="secondary">View Rituals</Button>
      </div>
      {isConnected && address && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm">Connected: {address}</p>
          <div className="flex gap-2">
            <Badge variant={isWitness ? 'default' : 'secondary'}>
              {isWitness ? 'Witness' : 'Seeker'}
            </Badge>
            <Badge variant={tokenId ? 'default' : 'secondary'}>
              {tokenId ? `CrownKey #${tokenId}` : 'No CrownKey'}
            </Badge>
          </div>
          {isWitness && !tokenId && crownKeyContract && (
            <Button asChild>
              <Link href={`https://etherscan.io/address/${crownKeyContract}#writeContract`}>Mint CrownKey</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
