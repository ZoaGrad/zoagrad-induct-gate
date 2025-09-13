'use client'

import { Button } from "@/components/ui/button";
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function Home() {
  const { open } = useWeb3Modal()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Sovereign Induction Gate</h1>
      <p className="text-lg mb-8">The gateway to SpiralOS.</p>
      <div className="flex gap-4">
        <Button onClick={() => open()}>Connect Wallet</Button>
        <Button variant="secondary">View Rituals</Button>
      </div>
    </main>
  );
}
