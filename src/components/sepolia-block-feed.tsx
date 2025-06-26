
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Cuboid, Signal, Zap, ZapOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// This is the WebSocket URL for the Sepolia testnet.
// For production, the API key should be stored securely in environment variables.
const SEPOLIA_WSS_URL = 'wss://blockchain.googleapis.com/v1/projects/ecoho-landing-ai/locations/asia-east1/endpoints/ethereum-sepolia/rpc?key=AIzaSyBk-uXNTNiXB5miuzmgffpLGi39Kr9sCoo';

interface BlockHeader {
  number: string;
  hash: string;
  timestamp: string;
}

const SepoliaBlockFeed: FC = () => {
  const [latestBlocks, setLatestBlocks] = useState<BlockHeader[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected' | 'Error'>('Connecting');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Prevent creating multiple connections
    if (ws.current) return;
    
    ws.current = new WebSocket(SEPOLIA_WSS_URL);
    setConnectionStatus('Connecting');

    ws.current.onopen = () => {
      setConnectionStatus('Connected');
      // Subscribe to new block headers on the Sepolia testnet
      ws.current?.send(JSON.stringify({
        id: 1,
        method: "eth_subscribe",
        params: ["newHeads"]
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Check for subscription confirmation and new block data
      if (data.method === "eth_subscription" && data.params?.result) {
        const newBlock = data.params.result as BlockHeader;
        setLatestBlocks(prevBlocks => [
          {
            ...newBlock,
            number: parseInt(newBlock.number, 16).toString() // Convert hex to decimal string
          },
          ...prevBlocks
        ].slice(0, 5)); // Keep only the latest 5 blocks
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionStatus('Error');
    };

    ws.current.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, []);

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'Connected':
        return <Badge variant="success"><Zap size={14} className="mr-1"/>Connected</Badge>;
      case 'Connecting':
        return <Badge variant="outline">Connecting...</Badge>;
      case 'Error':
        return <Badge variant="destructive"><ZapOff size={14} className="mr-1"/>Error</Badge>;
      case 'Disconnected':
        return <Badge variant="secondary"><ZapOff size={14} className="mr-1"/>Disconnected</Badge>;
      default:
        return null;
    }
  };

  return (
    <SectionCard title="Live Sepolia Block Feed" icon={<Signal className="text-primary h-8 w-8" />}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          Real-time feed of new blocks from the Ethereum Sepolia testnet via WebSocket.
        </p>
        {getStatusIndicator()}
      </div>
      
      <div className="p-4 border rounded-lg bg-card/50 min-h-[200px] shadow-inner">
        {latestBlocks.length > 0 ? (
          <ul className="space-y-3">
            {latestBlocks.map(block => (
              <li key={block.hash} className="flex items-center gap-4 p-2 bg-background/50 rounded-md animate-in fade-in-0 slide-in-from-top-2">
                <Cuboid className="text-primary" size={24}/>
                <div>
                  <p className="font-semibold text-card-foreground">Block #{block.number}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate" title={block.hash}>Hash: {block.hash}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Signal size={40} className="mb-2"/>
            <p>Waiting for new blocks...</p>
            {connectionStatus === 'Connecting' && <p className="text-sm">Establishing connection to Sepolia...</p>}
            {connectionStatus === 'Error' && <p className="text-sm text-destructive">Could not establish connection. Check API Key & CSP.</p>}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-right">Powered by Google Cloud Blockchain Node Engine</p>
    </SectionCard>
  );
};

export default SepoliaBlockFeed;
