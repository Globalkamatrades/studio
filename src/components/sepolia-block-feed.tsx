
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Cuboid, Signal, Zap, ZapOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';


interface BlockHeader {
  number: string;
  hash: string;
  timestamp: string;
}

const SepoliaBlockFeed: FC = () => {
  const [latestBlocks, setLatestBlocks] = useState<BlockHeader[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected' | 'Error'>('Connecting');
  const ws = useRef<WebSocket | null>(null);

  // This URL is now safely exposed to the client via a NEXT_PUBLIC_ prefixed environment variable
  const SEPOLIA_WSS_URL = process.env.NEXT_PUBLIC_SEPOLIA_WSS_URL;

  useEffect(() => {
    // If the URL is not configured, don't attempt to connect.
    if (!SEPOLIA_WSS_URL) {
        setConnectionStatus('Error');
        return;
    }

    // Prevent creating multiple connections on re-renders
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
  }, [SEPOLIA_WSS_URL]);

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

      {!SEPOLIA_WSS_URL ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Missing</AlertTitle>
          <AlertDescription>
            The WebSocket URL is not configured. Please set <code>NEXT_PUBLIC_SEPOLIA_WSS_URL</code> in your <code>.env</code> file.
          </AlertDescription>
        </Alert>
      ) : (
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
      )}
      <p className="text-xs text-muted-foreground mt-2 text-right">Powered by Google Cloud Blockchain Node Engine</p>
    </SectionCard>
  );
};

export default SepoliaBlockFeed;
