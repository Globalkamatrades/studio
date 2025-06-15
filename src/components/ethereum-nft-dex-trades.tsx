
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Updated to use the World Chain endpoint with embedded API key
const ALCHEMY_API_ENDPOINT_BASE = 'https://worldchain-mainnet.g.alchemy.com/v2/1VR8bGrYQ5hC3Kjd5wiOg';
const FROM_ADDRESS_TO_QUERY = "0x994b342dd87fc825f66e51ffa3ef71ad818b6893"; // Address from example, user may need to update for World Chain

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

// The API key is now embedded in ALCHEMY_API_ENDPOINT_BASE, so no need to pass it as an argument.
async function getRecentNftTransfers(): Promise<AlchemyTransfer[]> {
  const payload = {
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        fromAddress: FROM_ADDRESS_TO_QUERY,
        category: ["erc721", "erc1155"], // Fetching NFT transfers
        withMetadata: true,
        excludeZeroValue: false, 
        maxCount: "0xa", // Fetch 10 transfers
      },
    ],
    id: 0,
  };

  try {
    const response = await fetch(ALCHEMY_API_ENDPOINT_BASE, { // Use the full endpoint directly
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
    console.error('Failed to fetch NFT transfers from Alchemy (World Chain):', error);
    throw error; 
  }
}

const EthereumNftDexTrades: FC = () => {
  const [transfers, setTransfers] = useState<AlchemyTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // API key is now embedded in the endpoint, no need to pass it
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
  
  // This link points to Etherscan. If World Chain has a different block explorer, this URL should be updated.
  const getBlockExplorerLink = (hash: string) => `https://etherscan.io/tx/${hash}`;


  return (
    <SectionCard title={`Recent NFT Transfers from ${FROM_ADDRESS_TO_QUERY.substring(0,6)}...${FROM_ADDRESS_TO_QUERY.slice(-4)} (World Chain)`} icon={<ImageIcon className="text-primary h-8 w-8" />}>
      <p className="text-xs text-muted-foreground mb-3">
        Displaying NFT transfers for the specified address on World Chain, powered by Alchemy.
        The `FROM_ADDRESS_TO_QUERY` (<code>{FROM_ADDRESS_TO_QUERY}</code>) might need adjustment for relevant World Chain activity.
      </p>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading NFT transfers from World Chain...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching NFT Transfers from World Chain</p>
            <p>{error}</p>
            <p className="text-xs mt-1">This could be due to network issues with the Alchemy API or the specified address having no recent activity on World Chain.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && transfers.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No recent NFT transfers found for this address on World Chain or matching the criteria.</p>
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
        Displaying up to 10 most recent ERC721/ERC1155 transfers from World Chain. Data from Alchemy.
      </p>
    </SectionCard>
  );
};

export default EthereumNftDexTrades;
