
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { LineChart, AlertTriangle, ExternalLink, Droplets } from 'lucide-react';
import ButtonLink from './ui/button-link';

const GRAPHQL_ENDPOINT = 'https://api.placeholder.co/graphql/solana'; 
const ECOHO_MINT_ADDRESS = "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui";
const SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";
const ECOHO_SOL_MARKET_ADDRESS = "BSzedbEvWRqVksaF558epPWCM16avEpyhm2HgSq9WZyy";

interface TimefieldData {
  Time: string;
}

interface BlockData {
  Timefield: TimefieldData;
}

interface TradePriceData {
  high: number;
  low: number;
  open: number;
  close: number;
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

interface LiquidityBlockData {
  Timefield: TimefieldData;
}

interface LiquidityInfo {
  tokenLiquidity: number; // Monthly ECOHO Buy Volume
  wsolLiquidity: number; // Monthly SOL Sell Volume
  Block: LiquidityBlockData;
  // Trade?: { Market?: { MarketAddress?: string } }; // Not strictly needed for display
}

interface SolanaLiquidityResponseData {
  DEXTradeByTokens: LiquidityInfo[];
}

interface GraphQLLiquidityResponse {
  data?: {
    Solana?: SolanaLiquidityResponseData;
  };
  errors?: Array<{ message: string }>;
}


async function getMarketData(): Promise<DexTradeData | null> {
  const query = `
    query GetEcohoMarketData {
      Solana(dataset: combined) { # Changed from archive to combined
        DEXTradeByTokens(
          orderBy: { descendingByField: "Block_Timefield" }
          where: {
            Trade: {
              Currency: { MintAddress: { is: "${ECOHO_MINT_ADDRESS}" } }
              Side: { Currency: { MintAddress: { is: "${SOL_MINT_ADDRESS}" } } }
              PriceAsymmetry: { lt: 0.1 }
            }
          }
          limit: { count: 1 } 
        ) {
          Block {
            Timefield: Time(interval: { in: days, count: 1 })
          }
          volume: sum(of: Trade_Amount) 
          Trade {
            high: Price(maximum: Trade_Price)
            low: Price(minimum: Trade_Price)
            open: Price(minimum: Trade_Price)
            close: Price(maximum: Trade_Price)
          }
          count
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store', 
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GraphQL request for market data failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok. Status: ${response.status}.`);
    }

    const result = (await response.json()) as GraphQLResponse;

    if (result.errors) {
      console.error('GraphQL Market Data Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }
    
    const trades = result.data?.Solana?.DEXTradeByTokens;
    if (trades && trades.length > 0) {
      return trades[0]; 
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error; 
  }
}

async function getLiquidityData(): Promise<LiquidityInfo | null> {
  const query = `
    query GetEcohoLiquidityData {
      Solana(dataset: combined) {
        DEXTradeByTokens(
          where: {
            Trade: {
              Currency: { MintAddress: { is: "${ECOHO_MINT_ADDRESS}" } }
              Side: { Currency: { MintAddress: { is: "${SOL_MINT_ADDRESS}" } } }
              Market: { MarketAddress: { is: "${ECOHO_SOL_MARKET_ADDRESS}" } }
            }
          }
          orderBy: { descendingByField: "Block_Timefield" }
          limit: { count: 1 }
        ) {
          tokenLiquidity: sum(
            of: Trade_Amount
            if: { Trade: { Side: { Type: { is: buy } } } }
          )
          wsolLiquidity: sum(
            of: Trade_Side_Amount
            if: { Trade: { Side: { Type: { is: sell } } } }
          )
          Block {
            Timefield: Time(interval: { in: months, count: 1 })
          }
        }
      }
    }
  `;
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GraphQL request for liquidity data failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok for liquidity data. Status: ${response.status}.`);
    }
    
    const result = (await response.json()) as GraphQLLiquidityResponse;

    if (result.errors) {
      console.error('GraphQL Liquidity Data Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    const liquidityEntries = result.data?.Solana?.DEXTradeByTokens;
    if (liquidityEntries && liquidityEntries.length > 0) {
      return liquidityEntries[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch liquidity data:', error);
    throw error;
  }
}


interface MarketStatProps {
  label: string;
  value: string | number;
  unit?: string;
  isLoading?: boolean;
  isMonthly?: boolean;
}

const MarketStat: FC<MarketStatProps> = ({ label, value, unit, isLoading, isMonthly }) => {
  return (
    <div className="p-3 bg-card/50 rounded-lg shadow">
      <p className="text-sm text-muted-foreground">{label} {isMonthly && "(Monthly)"}</p>
      {isLoading ? (
        <div className="h-6 w-24 bg-muted-foreground/20 animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-xl font-semibold text-primary">
          {value === 'N/A' || value === null || value === undefined 
            ? 'N/A' 
            : typeof value === 'number' 
              ? value.toLocaleString(undefined, {maximumFractionDigits: unit === 'SOL' ? 4: 2, minimumFractionDigits: unit === 'SOL' ? 2 : 0 }) 
              : value}
          {unit && value !== 'N/A' && value !== null && value !== undefined && <span className="text-xs ml-1 text-muted-foreground">{unit}</span>}
        </p>
      )}
    </div>
  );
};


const MarketAnalytics: FC = async () => {
  let marketData: DexTradeData | null = null;
  let liquidityData: LiquidityInfo | null = null;
  let marketFetchError: string | null = null;
  let liquidityFetchError: string | null = null;
  let isLoading = true;

  try {
    const [marketResult, liquidityResult] = await Promise.allSettled([
      getMarketData(),
      getLiquidityData()
    ]);

    if (marketResult.status === 'fulfilled') {
      marketData = marketResult.value;
    } else {
      marketFetchError = marketResult.reason?.message || "Failed to load market data.";
      console.error('Market data fetch error:', marketResult.reason);
    }

    if (liquidityResult.status === 'fulfilled') {
      liquidityData = liquidityResult.value;
    } else {
      liquidityFetchError = liquidityResult.reason?.message || "Failed to load liquidity-related data.";
      console.error('Liquidity data fetch error:', liquidityResult.reason);
    }
    isLoading = false;
  } catch (error: any) { 
    // This catch block is less likely to be hit with Promise.allSettled,
    // but kept as a fallback. Errors are handled per promise.
    console.error('Generic error in MarketAnalytics data fetching:', error);
    marketFetchError = marketFetchError || error.message || "An unexpected error occurred loading market data.";
    liquidityFetchError = liquidityFetchError || error.message || "An unexpected error occurred loading liquidity data.";
    isLoading = false;
  }

  const birdeyeLink = `https://birdeye.so/token/${ECOHO_MINT_ADDRESS}?chain=solana`;
  const combinedError = [marketFetchError, liquidityFetchError].filter(Boolean).join(' ');

  return (
    <SectionCard 
      title="ECOHO Market Analytics (SOL)" 
      icon={<LineChart className="text-primary h-8 w-8" />}
      actions={
        <ButtonLink 
          href={birdeyeLink}
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

      {combinedError && !isLoading && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching Data</p>
            <p>{combinedError}</p>
          </div>
        </div>
      )}

      {!combinedError || isLoading ? ( // Show stats if no error or still loading
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground/90 flex items-center gap-2"><LineChart size={20} /> Daily Price & Volume</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    <MarketStat 
                    label="24h Volume" 
                    value={marketData?.volume ?? 'N/A'} 
                    unit="SOL"
                    isLoading={isLoading}
                    />
                    <MarketStat 
                    label="24h Trades" 
                    value={marketData?.count ?? 'N/A'}
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
                </div>
                {isLoading && !marketData && (
                    <div className="h-4 w-48 bg-muted-foreground/20 animate-pulse rounded mt-2 ml-auto"></div>
                )}
                {!isLoading && marketData?.Block?.Timefield?.Time && (
                    <p className="text-xs text-muted-foreground text-right mt-2">
                    Price/Volume data as of: {new Date(marketData.Block.Timefield.Time).toLocaleString()}
                    </p>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground/90 flex items-center gap-2"><Droplets size={20}/> Monthly Market Activity</h3>
                 <p className="text-xs text-muted-foreground mb-2">On market: {ECOHO_SOL_MARKET_ADDRESS}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MarketStat 
                        label="ECOHO Buy Volume" 
                        value={liquidityData?.tokenLiquidity ?? 'N/A'} 
                        unit="ECOHO"
                        isLoading={isLoading}
                        isMonthly={true}
                    />
                    <MarketStat 
                        label="SOL Volume (from ECOHO Sales)" 
                        value={liquidityData?.wsolLiquidity ?? 'N/A'} 
                        unit="SOL"
                        isLoading={isLoading}
                        isMonthly={true}
                    />
                </div>
                 {isLoading && !liquidityData && (
                    <div className="h-4 w-48 bg-muted-foreground/20 animate-pulse rounded mt-2 ml-auto"></div>
                )}
                {!isLoading && liquidityData?.Block?.Timefield?.Time && (
                    <p className="text-xs text-muted-foreground text-right mt-2">
                    Monthly activity data interval ending: {new Date(liquidityData.Block.Timefield.Time).toLocaleString()}
                    </p>
                )}
            </div>
           {!isLoading && !marketData && !liquidityData && !combinedError && (
             <p className="text-sm text-muted-foreground p-4 text-center">No market data available at the moment.</p>
           )}
        </div>
      ) : null}
    </SectionCard>
  );
};

export default MarketAnalytics;
