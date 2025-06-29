
"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { injected } from 'wagmi/connectors';
import { LogIn, LogOut, Wallet } from 'lucide-react';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
         <Button variant="outline" onClick={() => disconnect()}>
            <LogOut size={18} />
            Disconnect
        </Button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-foreground bg-secondary px-3 py-2 rounded-md">
            <Wallet size={18} className="text-primary"/>
            <span className="font-mono">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })}>
      <LogIn size={18} />
      Connect Wallet
    </Button>
  );
}
