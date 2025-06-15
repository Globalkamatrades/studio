
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';

// Placeholder - Replace with your actual GraphQL endpoint for EVM data
const GRAPHQL_ENDPOINT_EVM = 'https://api.placeholder.co/graphql/ethereum'; // Or your Bitquery endpoint

interface EvmTradeCurrency {
  Symbol: string;
  SmartContract: string;
}

interface EvmTradeBuyDetail {
  Currency: EvmTradeCurrency;
  min_price: number;
  max_price: number; 
}

interface EvmTradeSellDetail {
  Currency: EvmTradeCurrency;
}

interface EvmTradeData {
  Trade: {
    Buy: EvmTradeBuyDetail;
    Sell: EvmTradeSellDetail;
  };
  buy_amount: string;
  sell_amount: string;
  count: string;
}

interface EvmDEXTradesResponse {
  EVM?: {
    DEXTrades?: EvmTradeData[];
  };
}

interface GraphQLResponse {
  data?: EvmDEXTradesResponse;
  errors?: Array<{ message: string }>;
}

async function getEthereumNftDexTrades(): Promise<EvmTradeData[]> {
  const query = `
    query GetEthereumNftDexTrades {
      EVM(dataset: combined, network: eth) {
        DEXTrades(
          orderBy: {descendingByField: "count"}
          limit: {offset: 0, count: 10}
          where: {Block: {Date: {since: "2023-05-01", till: "2023-05-28"}}, Trade: {Buy: {Currency: {Fungible: false}}, Sell: {Currency: {Fungible: true}}}}
        ) {
          Trade {
            Buy {
              Currency {
                Symbol
                SmartContract
              }
              min_price: Price(minimum: Trade_Buy_Price)
              max_price: Price(maximum: Trade_Buy_Price)
            }
            Sell {
              Currency {
                Symbol
                SmartContract
              }
            }
          }
          buy_amount: sum(of: Trade_Buy_Amount)
          sell_amount: sum(of: Trade_Sell_Amount)
          count
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT_EVM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your API key header here if required by your GraphQL endpoint
        // 'X-API-KEY': process.env.YOUR_GRAPHQL_API_KEY_ENV_VAR_NAME 
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GraphQL request for EVM NFT trades failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok. Status: ${response.status}.`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      console.error('GraphQL EVM NFT Trades Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    return result.data?.EVM?.DEXTrades || [];
  } catch (error) {
    console.error('Failed to fetch Ethereum NFT DEX trades:', error);
    throw error; // Re-throw to be caught by the component
  }
}

const EthereumNftDexTrades: FC = () => {
  const [trades, setTrades] = useState<EvmTradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEthereumNftDexTrades();
        setTrades(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load Ethereum NFT DEX trades.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <SectionCard title="Top NFT Sales on Ethereum DEXs (May 2023)" icon={<ImageIcon className="text-primary h-8 w-8" />}>
      {GRAPHQL_ENDPOINT_EVM.includes('api.placeholder.co') && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>The GraphQL endpoint for Ethereum DEX Trades is currently a placeholder. Update <code>src/components/ethereum-nft-dex-trades.tsx</code> with your actual API endpoint to see live data. The date range is fixed to May 2023 as per the query.</span>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading NFT trades data...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching Ethereum NFT Trades</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && trades.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No NFT trades data available for the specified period.</p>
      )}

      {!isLoading && !error && trades.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NFT Symbol</TableHead>
              <TableHead className="text-right">Min Price (Sold For)</TableHead>
              <TableHead className="text-right">Max Price (Sold For)</TableHead>
              <TableHead>Sold For Currency</TableHead>
              <TableHead className="text-right">Trade Count</TableHead>
              <TableHead className="text-right">Total NFT Amount</TableHead>
              <TableHead className="text-right">Total Sell Currency Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, index) => (
              <TableRow key={`${trade.Trade.Buy.Currency.SmartContract}-${index}`}>
                <TableCell className="font-medium">
                  {trade.Trade.Buy.Currency.Symbol || 'N/A'}
                  <div className="text-xs text-muted-foreground truncate" style={{maxWidth: '150px'}} title={trade.Trade.Buy.Currency.SmartContract}>
                    {trade.Trade.Buy.Currency.SmartContract}
                  </div>
                </TableCell>
                <TableCell className="text-right">{trade.Trade.Buy.min_price?.toFixed(4) ?? 'N/A'}</TableCell>
                <TableCell className="text-right">{trade.Trade.Buy.max_price?.toFixed(4) ?? 'N/A'}</TableCell>
                <TableCell>
                  {trade.Trade.Sell.Currency.Symbol || 'N/A'}
                   <div className="text-xs text-muted-foreground truncate" style={{maxWidth: '150px'}} title={trade.Trade.Sell.Currency.SmartContract}>
                    {trade.Trade.Sell.Currency.SmartContract === "0x" ? "Native (ETH)" : trade.Trade.Sell.Currency.SmartContract}
                  </div>
                </TableCell>
                <TableCell className="text-right">{trade.count}</TableCell>
                <TableCell className="text-right">{parseFloat(trade.buy_amount).toLocaleString()}</TableCell>
                <TableCell className="text-right">{parseFloat(trade.sell_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="text-xs text-muted-foreground mt-2 text-right">
        Data for trades where NFTs were bought with fungible tokens on Ethereum, May 1-28, 2023. Ordered by trade count.
      </p>
    </SectionCard>
  );
};

export default EthereumNftDexTrades;
