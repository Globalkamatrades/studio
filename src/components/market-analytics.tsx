
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { LineChart, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ButtonLink from './ui/button-link';

// IMPORTANT: Replace this with your actual GraphQL endpoint.
const GRAPHQL_ENDPOINT = 'https://api.placeholder.co/graphql/solana'; 
// This is a placeholder. You need a real GraphQL provider that supports your query.
// For example, some services provide Solana data via GraphQL.

const ECOHO_MINT_ADDRESS = "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui";
const SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";

interface TimefieldData {
  Time: string; // Assuming 'YYYY-MM-DDTHH:MM:SSZ' or similar
}

interface BlockData {
  Timefield: TimefieldData;
}

interface TradePriceData {
  high: number;
  low: number;
  open: number; // Based on Block_Slot min in query
  close: number; // Based on Block_Slot max in query
}

interface DexTradeData {
  Block: BlockData;
  volume: number;
  Trade: TradePriceData;
  count: number;
}

interface SolanaResponseData {
  DEXTradeByTokens: DexTradeData[];
}

interface GraphQLResponse {
  data?: {
    Solana?: SolanaResponseData;
  };
  errors?: Array<{ message: string }>;
}

async function getMarketData(): Promise<DexTradeData | null> {
  const query = `
    query GetEcohoMarketData {
      Solana(dataset: archive) {
        DEXTradeByTokens(
          orderBy: { descendingByField: "Block_Timefield" }
          where: {
            Trade: {
              Currency: { MintAddress: { is: "${ECOHO_MINT_ADDRESS}" } }
              Side: { Currency: { MintAddress: { is: "${SOL_MINT_ADDRESS}" } } }
              PriceAsymmetry: { lt: 0.1 }
            }
          }
          limit: { count: 1 } # Get the latest 1-day interval data
        ) {
          Block {
            Timefield: Time(interval: { in: days, count: 1 })
          }
          volume: sum(of: Trade_Amount) # Assuming Trade_Amount is in SOL (quote currency)
          Trade {
            high: Price(maximum: Trade_Price)
            low: Price(minimum: Trade_Price)
            # The open/close in the original query used Block_Slot, which isn't typical for price.
            # If actual OHLC prices for the interval are needed, the query might need adjustment
            # or these fields might represent something else. For now, we focus on high/low.
            open: Price(minimum: Trade_Price) # Adjusted to use Trade_Price for consistency if needed
            close: Price(maximum: Trade_Price) # Adjusted to use Trade_Price for consistency if needed
          }
          count
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary API keys or authorization headers here
        // 'Authorization': `Bearer YOUR_API_KEY`
      },
      body: JSON.stringify({ query }),
      cache: 'no-store', // Fetch fresh data on each request
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GraphQL request failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok. Status: ${response.status}.`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }
    
    const trades = result.data?.Solana?.DEXTradeByTokens;
    if (trades && trades.length > 0) {
      return trades[0]; // Return the first (latest) data point
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error; // Re-throw to be caught by the component
  }
}

interface MarketStatProps {
  label: string;
  value: string | number;
  unit?: string;
  isLoading?: boolean;
}

const MarketStat: FC<MarketStatProps> = ({ label, value, unit, isLoading }) => {
  return (
    <div className="p-3 bg-card/50 rounded-lg shadow">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? (
        <div className="h-6 w-24 bg-muted-foreground/20 animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-xl font-semibold text-primary">
          {typeof value === 'number' ? value.toLocaleString(undefined, {maximumFractionDigits: unit === 'SOL' ? 4: 2, minimumFractionDigits: unit === 'SOL' ? 2 : 0 }) : value}
          {unit && <span className="text-xs ml-1 text-muted-foreground">{unit}</span>}
        </p>
      )}
    </div>
  );
};


const MarketAnalytics: FC = async () => {
  let marketData: DexTradeData | null = null;
  let fetchError: string | null = null;
  let isLoading = true; // Start with loading true

  try {
    marketData = await getMarketData();
    isLoading = false;
  } catch (error: any) {
    fetchError = error.message || "Failed to load market data. The API endpoint might be a placeholder or unavailable.";
    isLoading = false;
  }

  const бирдекеLink = `https://birdeye.so/token/${ECOHO_MINT_ADDRESS}?chain=solana`;

  return (
    <SectionCard 
      title="ECOHO Market Analytics (SOL)" 
      icon={<LineChart className="text-primary h-8 w-8" />}
      actions={
        <ButtonLink 
          href={бирдекеLink}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
          className="text-xs"
          icon={<ExternalLink size={14} />}
        >
          View on Birdeye
        </ButtonLink>
      }
    >
      {GRAPHQL_ENDPOINT.includes('api.placeholder.co') && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>The GraphQL endpoint is currently a placeholder. Update <code>src/components/market-analytics.tsx</code> with your actual API endpoint to see live data.</span>
        </div>
      )}

      {fetchError && !isLoading && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching Data</p>
            <p>{fetchError}</p>
          </div>
        </div>
      )}

      {!fetchError && (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MarketStat 
              label="24h Volume" 
              value={marketData?.volume ?? 'N/A'} 
              unit="SOL"
              isLoading={isLoading}
            />
            <MarketStat 
              label="24h High Price" 
              value={marketData?.Trade?.high ?? 'N/A'} 
              unit="SOL"
              isLoading={isLoading}
            />
            <MarketStat 
              label="24h Low Price" 
              value={marketData?.Trade?.low ?? 'N/A'} 
              unit="SOL"
              isLoading={isLoading}
            />
            <MarketStat 
              label="24h Trades" 
              value={marketData?.count ?? 'N/A'}
              isLoading={isLoading}
            />
          </div>
          {isLoading ? (
             <div className="h-4 w-48 bg-muted-foreground/20 animate-pulse rounded mt-2"></div>
          ) : marketData?.Block?.Timefield?.Time && (
            <p className="text-xs text-muted-foreground text-right mt-2">
              Data as of: {new Date(marketData.Block.Timefield.Time).toLocaleString()}
            </p>
          )}
           {!isLoading && !marketData && !fetchError && (
             <p className="text-sm text-muted-foreground p-4 text-center">No market data available at the moment.</p>
           )}
        </div>
      )}
    </SectionCard>
  );
};

export default MarketAnalytics;

    