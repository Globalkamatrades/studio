
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALCHEMY_API_ENDPOINT_BASE = 'https://eth-mainnet.g.alchemy.com/v2/YOUR_ETHEREUM_ALCHEMY_API_KEY_HERE';
const TARGET_TO_ADDRESS = "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1";
const TARGET_CONTRACT_ADDRESSES = ["0x06012c8cf97BEaD5deAe237070F9587f8E7A266d"]; // CryptoKitties contract

interface AlchemyTransfer {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  erc721TokenId: string | null;
  erc1155Metadata: { tokenId: string; value: string; }[] | null;
  asset: string | null;
  category: string;
  rawContract: {
    value: string | null;
    address: string | null;
    decimal: string | null;
  };
  metadata?: {
    blockTimestamp: string;
  };
}

interface AlchemyApiResponse {
  jsonrpc: string;
  id: number;
  result?: {
    transfers: AlchemyTransfer[];
  };
  error?: {
    code: number;
    message: string;
  };
}

async function getRecentNftTransfers(): Promise<AlchemyTransfer[]> {
  if (ALCHEMY_API_ENDPOINT_BASE.includes('YOUR_ETHEREUM_ALCHEMY_API_KEY_HERE')) {
    console.warn('Alchemy API key is a placeholder. NFT transfer data will not be fetched.');
    return [];
  }
  const payload = {
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toAddress: TARGET_TO_ADDRESS,
        contractAddresses: TARGET_CONTRACT_ADDRESSES,
        category: ["erc721", "erc1155"],
        withMetadata: true,
        excludeZeroValue: false, // As per screenshot
        maxCount: "0xa", // Fetch 10 transfers, as per screenshot
      },
    ],
    id: 0,
  };

  try {
    const response = await fetch(ALCHEMY_API_ENDPOINT_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Alchemy API request failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${errorBody}`);
    }

    const result = (await response.json()) as AlchemyApiResponse;

    if (result.error) {
      console.error('Alchemy API Error:', result.error);
      throw new Error(`Alchemy API Error: ${result.error.message} (Code: ${result.error.code})`);
    }

    return result.result?.transfers || [];
  } catch (error) {
    console.error('Failed to fetch NFT transfers from Alchemy (Ethereum):', error);
    throw error;
  }
}

const EthereumNftDexTrades: FC = () => {
  const [transfers, setTransfers] = useState<AlchemyTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaceholderKey, setIsPlaceholderKey] = useState(false);

  useEffect(() => {
    if (ALCHEMY_API_ENDPOINT_BASE.includes('YOUR_ETHEREUM_ALCHEMY_API_KEY_HERE')) {
      setIsPlaceholderKey(true);
      setError("Alchemy API key for Ethereum is missing. Please add it to .env and update the component to fetch live data.");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecentNftTransfers();
        setTransfers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load NFT transfers.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDisplayTokenId = (transfer: AlchemyTransfer): string => {
    if (transfer.erc721TokenId) {
      try {
        return BigInt(transfer.erc721TokenId).toString(10);
      } catch {
        return transfer.erc721TokenId;
      }
    }
    if (transfer.erc1155Metadata && transfer.erc1155Metadata.length > 0) {
      try {
        return BigInt(transfer.erc1155Metadata[0].tokenId).toString(10);
      } catch {
        return transfer.erc1155Metadata[0].tokenId;
      }
    }
    return 'N/A';
  };

  const getBlockExplorerLink = (hash: string) => `https://etherscan.io/tx/${hash}`;
  
  const contractDisplay = TARGET_CONTRACT_ADDRESSES.map(addr => `${addr.substring(0,6)}...${addr.slice(-4)}`).join(', ');

  return (
    <SectionCard title={`NFT Transfers for Contract(s) ${contractDisplay} to ${TARGET_TO_ADDRESS.substring(0,6)}...${TARGET_TO_ADDRESS.slice(-4)} (Ethereum)`} icon={<ImageIcon className="text-primary h-8 w-8" />}>
      <p className="text-xs text-muted-foreground mb-1">
        Displaying recent ERC721/ERC1155 NFT transfers for contract(s) <code className="text-xs">{TARGET_CONTRACT_ADDRESSES.join(', ')}</code> (e.g., CryptoKitties) sent to the address <code className="text-xs">{TARGET_TO_ADDRESS}</code> on the Ethereum mainnet.
      </p>
      {isPlaceholderKey && (
         <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-md text-sm flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>An Alchemy API key for Ethereum mainnet is required to fetch live data. Please update the placeholder in <code>src/components/ethereum-nft-dex-trades.tsx</code>.</span>
         </div>
      )}
      <p className="text-xs text-muted-foreground mb-3">
        Data powered by Alchemy.
      </p>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading Ethereum NFT transfers...</p>
        </div>
      )}

      {!isLoading && error && !isPlaceholderKey && ( 
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching Ethereum NFT Transfers</p>
            <p>{error}</p>
            <p className="text-xs mt-1">This could be due to network issues with the Alchemy API or the specified address/contracts having no recent activity on Ethereum.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && transfers.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No recent NFT transfers found matching the specified criteria on Ethereum.</p>
      )}

      {!isLoading && !error && transfers.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Token ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer.hash}>
                <TableCell>
                  {transfer.metadata?.blockTimestamp
                    ? new Date(transfer.metadata.blockTimestamp).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="font-medium">
                  {transfer.asset || 'Unknown Asset'}
                  {transfer.rawContract?.address && (
                     <div className="text-xs text-muted-foreground truncate" style={{maxWidth: '150px'}} title={transfer.rawContract.address}>
                        {transfer.rawContract.address}
                     </div>
                  )}
                </TableCell>
                <TableCell>{getDisplayTokenId(transfer)}</TableCell>
                <TableCell className="truncate" style={{maxWidth: '150px'}} title={transfer.from}>{transfer.from}</TableCell>
                <TableCell className="truncate" style={{maxWidth: '150px'}} title={transfer.to}>{transfer.to}</TableCell>
                <TableCell className="text-right">
                   <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <a href={getBlockExplorerLink(transfer.hash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      View <ExternalLink size={12} />
                    </a>
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="text-xs text-muted-foreground mt-2 text-right">
        Displaying up to 10 most recent ERC721/ERC1155 transfers from Ethereum.
      </p>
    </SectionCard>
  );
};

export default EthereumNftDexTrades;
```