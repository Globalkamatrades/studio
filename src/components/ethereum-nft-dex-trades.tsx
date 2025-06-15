
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';

// Updated to use The Graph Network Subgraph for Arbitrum
const SUBGRAPH_ID = "DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp";
const GRAPHQL_ENDPOINT_EVM = `https://gateway.thegraph.com/api/subgraphs/id/${SUBGRAPH_ID}`;

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

// IMPORTANT: This interface will likely need to be adjusted based on the actual schema
// of The Graph subgraph 'DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp'.
// The current structure is based on the OLD placeholder API.
interface EvmTradeData {
  Trade: {
    Buy: EvmTradeBuyDetail;
    Sell: EvmTradeSellDetail;
  };
  buy_amount: string;
  sell_amount: string;
  count: string;
  // Add other fields that your new query for The Graph might return
}

interface EvmDEXTradesResponse {
  // This top-level structure will depend on your NEW query for The Graph.
  // For example, it might be `data: { yourQueryRootField: EvmTradeData[] }`
  // The example query for The Graph was:
  // { graphNetworks(first: 5) { ... }, graphAccounts(first: 5) { ... } }
  // This is NOT for NFT trades. You need to replace it.
  EVM?: { // This 'EVM' key is from the OLD API structure.
    DEXTrades?: EvmTradeData[]; // This 'DEXTrades' key is from OLD API.
  };
  // If your new query for The Graph returns data directly under 'data', adjust accordingly.
  // e.g. data?: { someTradesField?: EvmTradeData[] }
}

interface GraphQLResponse {
  data?: EvmDEXTradesResponse; // Or your new response structure from The Graph
  errors?: Array<{ message: string }>;
}

async function getEthereumNftDexTrades(): Promise<EvmTradeData[]> {
  const apiKey = process.env.NEXT_PUBLIC_THEGRAPH_GATEWAY_API_KEY;

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_THEGRAPH_GATEWAY_API_KEY is not set. API calls will likely fail.");
    // Optionally, throw an error or return empty data to prevent API calls without a key
    // throw new Error("API key for The Graph is missing.");
  }

  // !!! IMPORTANT !!!
  // The GraphQL query below is from the OLD placeholder API.
  // It WILL NOT WORK with The Graph subgraph 'DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp'
  // unless that subgraph happens to have an identical schema (which is highly unlikely).
  // You MUST REPLACE this query with one that is valid for the schema of your target subgraph
  // and fetches Ethereum NFT DEX trades data.
  //
  // You can explore the subgraph's schema and test queries on The Graph Explorer.
  // The example query provided with The Graph API info was:
  // { graphNetworks(first: 5) { id controller graphToken epochManager } graphAccounts(first: 5) { id names { id } defaultName { id } createdAt } }
  // This query is for general graph network information, NOT for NFT trades.
  const query = `
    query GetEthereumNftDexTrades_NEEDS_REPLACEMENT {
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT_EVM, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query }), // Ensure your 'query' variable holds the CORRECT query string
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GraphQL request for EVM NFT trades failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${errorBody}`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      console.error('GraphQL EVM NFT Trades Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    // IMPORTANT: Adjust this data access path based on your NEW query's response structure.
    // The path 'data.EVM.DEXTrades' is from the OLD API.
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
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_THEGRAPH_GATEWAY_API_KEY) {
      setApiKeyMissing(true);
    }
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

  const warningMessage = apiKeyMissing
    ? "The API Key for The Graph (NEXT_PUBLIC_THEGRAPH_GATEWAY_API_KEY) is missing from your .env file. Please add it to fetch data."
    : "This component is configured to use The Graph. Ensure your API key is set in .env. The GraphQL query in `getEthereumNftDexTrades` function needs to be verified or updated to match the schema of the configured subgraph (" + SUBGRAPH_ID + ") to fetch relevant Ethereum NFT DEX trades. The current query is a placeholder and likely incorrect for this subgraph.";


  return (
    <SectionCard title="Top NFT Sales on Ethereum DEXs" icon={<ImageIcon className="text-primary h-8 w-8" />}>
      {(apiKeyMissing || GRAPHQL_ENDPOINT_EVM.includes(SUBGRAPH_ID)) && ( // Show warning if API key missing or if we are using The Graph
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>{warningMessage}</span>
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
            <p className="text-xs mt-1">This could be due to a missing/invalid API key, an incorrect GraphQL query for the selected subgraph, or network issues.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && trades.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No NFT trades data available. This could be due to the query needing adjustment for the new API or no data matching the (potentially incorrect) current query.</p>
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
              <TableRow key={`${trade.Trade?.Buy?.Currency?.SmartContract || index}-${index}`}>
                <TableCell className="font-medium">
                  {trade.Trade?.Buy?.Currency?.Symbol || 'N/A'}
                  <div className="text-xs text-muted-foreground truncate" style={{maxWidth: '150px'}} title={trade.Trade?.Buy?.Currency?.SmartContract}>
                    {trade.Trade?.Buy?.Currency?.SmartContract}
                  </div>
                </TableCell>
                <TableCell className="text-right">{trade.Trade?.Buy?.min_price?.toFixed(4) ?? 'N/A'}</TableCell>
                <TableCell className="text-right">{trade.Trade?.Buy?.max_price?.toFixed(4) ?? 'N/A'}</TableCell>
                <TableCell>
                  {trade.Trade?.Sell?.Currency?.Symbol || 'N/A'}
                   <div className="text-xs text-muted-foreground truncate" style={{maxWidth: '150px'}} title={trade.Trade?.Sell?.Currency?.SmartContract}>
                    {trade.Trade?.Sell?.Currency?.SmartContract === "0x" ? "Native (ETH)" : trade.Trade?.Sell?.Currency?.SmartContract}
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
        Data attempts to show trades where NFTs were bought with fungible tokens. Query needs validation for The Graph.
      </p>
    </SectionCard>
  );
};

export default EthereumNftDexTrades;
