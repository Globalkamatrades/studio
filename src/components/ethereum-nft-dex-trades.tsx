
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALCHEMY_API_ENDPOINT_BASE = 'https://eth-mainnet.g.alchemy.com/v2/';
const FROM_ADDRESS_TO_QUERY = "0x994b342dd87fc825f66e51ffa3ef71ad818b6893"; // Address from example

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

async function getRecentNftTransfers(apiKey: string | undefined): Promise<AlchemyTransfer[]> {
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_ALCHEMY_API_KEY is not set. API calls will fail.");
    throw new Error("Alchemy API key is missing.");
  }

  const apiEndpoint = `${ALCHEMY_API_ENDPOINT_BASE}${apiKey}`;

  const payload = {
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        fromAddress: FROM_ADDRESS_TO_QUERY,
        category: ["erc721", "erc1155"],
        withMetadata: true,
        excludeZeroValue: false, 
        maxCount: "0xa", // Fetch 10 transfers
      },
    ],
    id: 0,
  };

  try {
    const response = await fetch(apiEndpoint, {
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
    console.error('Failed to fetch NFT transfers from Alchemy:', error);
    throw error; 
  }
}

const EthereumNftDexTrades: FC = () => {
  const [transfers, setTransfers] = useState<AlchemyTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    setApiKey(key);

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecentNftTransfers(key);
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
        return transfer.erc721TokenId; // Fallback if not a valid hex BigInt
      }
    }
    if (transfer.erc1155Metadata && transfer.erc1155Metadata.length > 0) {
      // For simplicity, show the first token ID for ERC1155 if multiple
      try {
        return BigInt(transfer.erc1155Metadata[0].tokenId).toString(10);
      } catch {
        return transfer.erc1155Metadata[0].tokenId;
      }
    }
    return 'N/A';
  };
  
  const getEtherscanLink = (hash: string) => `https://etherscan.io/tx/${hash}`;

  const warningMessage = !apiKey
    ? "The Alchemy API Key (NEXT_PUBLIC_ALCHEMY_API_KEY) is missing from your .env file. Please add it to fetch data."
    : null;

  return (
    <SectionCard title={`Recent NFT Transfers from ${FROM_ADDRESS_TO_QUERY.substring(0,6)}...${FROM_ADDRESS_TO_QUERY.slice(-4)} (ETH)`} icon={<ImageIcon className="text-primary h-8 w-8" />}>
      {warningMessage && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>{warningMessage}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading NFT transfers...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching NFT Transfers</p>
            <p>{error}</p>
            <p className="text-xs mt-1">This could be due to a missing/invalid API key or network issues with the Alchemy API.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && transfers.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No recent NFT transfers found for this address or matching the criteria.</p>
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
                    <a href={getEtherscanLink(transfer.hash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
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
        Displaying up to 10 most recent ERC721/ERC1155 transfers. Data from Alchemy.
      </p>
    </SectionCard>
  );
};

export default EthereumNftDexTrades;
