
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { LineChart, AlertTriangle, ExternalLink, Droplets, TrendingUp, DollarSign } from 'lucide-react'; // Added TrendingUp
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
  tokenLiquidity: number; 
  wsolLiquidity: number; 
  Block: LiquidityBlockData;
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

interface AthPriceInfo {
  athPriceUSD: number;
}

interface SolanaAthResponseData {
    DEXTradeByTokens: AthPriceInfo[];
}

interface GraphQLAthResponse {
  data?: {
    Solana?: SolanaAthResponseData;
  };
  errors?: Array<{ message: string }>;
}


async function getMarketData(): Promise<DexTradeData | null> {
  const query = `
    query GetEcohoMarketData {
      Solana(dataset: combined) {
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
      throw new Error(`Network response for market data was not ok. Status: ${response.status}.`);
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
  } catch (error: any) {
    let specificError: Error;
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch failed') && GRAPHQL_ENDPOINT.includes('api.placeholder.co')) {
      specificError = new Error(`Fetch failed for market data from placeholder API (${GRAPHQL_ENDPOINT}). Please update to a live API endpoint.`);
    } else if (error instanceof Error) {
      specificError = new Error(`Failed to fetch market data: ${error.message}`);
    } else {
      specificError = new Error('Failed to fetch market data due to an unknown error.');
    }
    if (error instanceof Error && error.stack) specificError.stack = error.stack;
    console.error(specificError.message, error); 
    throw specificError;
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
      throw new Error(`Network response for liquidity data was not ok. Status: ${response.status}.`);
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
  } catch (error: any) {
    let specificError: Error;
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch failed') && GRAPHQL_ENDPOINT.includes('api.placeholder.co')) {
      specificError = new Error(`Fetch failed for liquidity data from placeholder API (${GRAPHQL_ENDPOINT}). Please update to a live API endpoint.`);
    } else if (error instanceof Error) {
      specificError = new Error(`Failed to fetch liquidity data: ${error.message}`);
    } else {
      specificError = new Error('Failed to fetch liquidity data due to an unknown error.');
    }
    if (error instanceof Error && error.stack) specificError.stack = error.stack;
    console.error(specificError.message, error);
    throw specificError;
  }
}

async function getEcohoAthPrice(): Promise<number | null> {
  const query = `
    query GetEcohoAthPrice {
      Solana(dataset: archive) { # Using archive dataset for ATH
        DEXTradeByTokens(
          where: { Trade: { Currency: { MintAddress: { is: "${ECOHO_MINT_ADDRESS}" } } } }
          limit: { count: 1 } # We expect a single ATH value
        ) {
          athPriceUSD: quantile(of: Trade_PriceInUSD, level: 0.99) # 99th percentile as ATH proxy
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
      console.error(`GraphQL request for ATH data failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response for ATH data was not ok. Status: ${response.status}.`);
    }

    const result = (await response.json()) as GraphQLAthResponse;

    if (result.errors) {
      console.error('GraphQL ATH Data Errors:', result.errors);
      throw new Error(result.errors.map(e => e.message).join(', '));
    }

    const athEntries = result.data?.Solana?.DEXTradeByTokens;
    if (athEntries && athEntries.length > 0 && athEntries[0].athPriceUSD !== null && athEntries[0].athPriceUSD !== undefined) {
      return athEntries[0].athPriceUSD;
    }
    return null;
  } catch (error: any) {
    let specificError: Error;
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch failed') && GRAPHQL_ENDPOINT.includes('api.placeholder.co')) {
      specificError = new Error(`Fetch failed for ATH price data from placeholder API (${GRAPHQL_ENDPOINT}). Please update to a live API endpoint.`);
    } else if (error instanceof Error) {
      specificError = new Error(`Failed to fetch ATH price data: ${error.message}`);
    } else {
      specificError = new Error('Failed to fetch ATH price data due to an unknown error.');
    }
    if (error instanceof Error && error.stack) specificError.stack = error.stack;
    console.error(specificError.message, error);
    throw specificError;
  }
}


interface MarketStatProps {
  label: string;
  value: string | number;
  unit?: string;
  isLoading?: boolean;
  isMonthly?: boolean;
  icon?: React.ReactNode;
}

const MarketStat: FC<MarketStatProps> = ({ label, value, unit, isLoading, isMonthly, icon }) => {
  return (
    <div className="p-3 bg-card/50 rounded-lg shadow">
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        {icon}
        {label} {isMonthly && "(Monthly)"}
      </p>
      {isLoading ? (
        <div className="h-6 w-24 bg-muted-foreground/20 animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-xl font-semibold text-primary">
          {value === 'N/A' || value === null || value === undefined 
            ? 'N/A' 
            : typeof value === 'number' 
              ? value.toLocaleString(undefined, {maximumFractionDigits: unit === 'SOL' || unit === 'USD' ? 4: 2, minimumFractionDigits: unit === 'SOL' || unit === 'USD' ? 2 : 0 }) 
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
  let athPriceData: number | null = null;
  let marketFetchError: string | null = null;
  let liquidityFetchError: string | null = null;
  let athFetchError: string | null = null;
  let isLoading = true;

  try {
    const [marketResult, liquidityResult, athResult] = await Promise.allSettled([
      getMarketData(),
      getLiquidityData(),
      getEcohoAthPrice()
    ]);

    if (marketResult.status === 'fulfilled') {
      marketData = marketResult.value;
    } else {
      marketFetchError = marketResult.reason?.message || "Failed to load market data.";
      console.error('Market data fetch error (handled by component):', marketResult.reason);
    }

    if (liquidityResult.status === 'fulfilled') {
      liquidityData = liquidityResult.value;
    } else {
      liquidityFetchError = liquidityResult.reason?.message || "Failed to load liquidity-related data.";
      console.error('Liquidity data fetch error (handled by component):', liquidityResult.reason);
    }

    if (athResult.status === 'fulfilled') {
      athPriceData = athResult.value;
    } else {
      athFetchError = athResult.reason?.message || "Failed to load ATH price data.";
      console.error('ATH price data fetch error (handled by component):', athResult.reason);
    }
    isLoading = false;
  } catch (error: any) { 
    console.error('Generic error in MarketAnalytics data fetching (should not be reached if Promise.allSettled is used correctly):', error);
    marketFetchError = marketFetchError || error.message || "An unexpected error occurred loading market data.";
    liquidityFetchError = liquidityFetchError || error.message || "An unexpected error occurred loading liquidity data.";
    athFetchError = athFetchError || error.message || "An unexpected error occurred loading ATH data.";
    isLoading = false;
  }

  const birdeyeLink = `https://birdeye.so/token/${ECOHO_MINT_ADDRESS}?chain=solana`;
  
  const errorMessages: string[] = [];
  if (marketFetchError) errorMessages.push(`Market data: ${marketFetchError}`);
  if (liquidityFetchError) errorMessages.push(`Liquidity data: ${liquidityFetchError}`);
  if (athFetchError) errorMessages.push(`ATH price data: ${athFetchError}`);

  let displayError: string | null = null;
  if (errorMessages.length > 0) {
    const allRawMessages = [marketFetchError, liquidityFetchError, athFetchError].filter(Boolean) as string[];
    const uniqueRawMessages = [...new Set(allRawMessages)];
    
    // Check if all unique messages indicate a placeholder API issue
    const allPlaceholderRelated = uniqueRawMessages.every(msg => msg.toLowerCase().includes('placeholder api') || msg.toLowerCase().includes('fetch failed for'));

    if (allPlaceholderRelated && uniqueRawMessages.length >=1) {
        displayError = `Multiple data fetches failed. This is likely due to the placeholder API (${GRAPHQL_ENDPOINT}). Please update it to a live endpoint.`;
         if (uniqueRawMessages.length === 1) {
            displayError = uniqueRawMessages[0]; // Show the specific message if it's the same for all
         }
    } else if (uniqueRawMessages.length === 1 && allRawMessages.length > 1) {
      displayError = `Multiple data fetches failed with the same error: ${uniqueRawMessages[0]}`;
    } 
     else {
      displayError = errorMessages.join('. ') + '.';
    }

    if (GRAPHQL_ENDPOINT.includes('api.placeholder.co') && displayError && !displayError.toLowerCase().includes("placeholder api")) {
        displayError += " This is likely due to the placeholder API. Please update it with a live endpoint to see data.";
    }
  }


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

      {displayError && !isLoading && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <div>
            <p className="font-semibold">Error Fetching Data</p>
            <p>{displayError}</p>
          </div>
        </div>
      )}

      {(!displayError || isLoading) && ( 
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground/90 flex items-center gap-2"><LineChart size={20} /> Daily Price & Volume</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MarketStat 
                        label="24h Volume" 
                        value={marketData?.volume ?? 'N/A'} 
                        unit="SOL"
                        isLoading={isLoading}
                        icon={<DollarSign size={16} className="text-muted-foreground" />}
                    />
                    <MarketStat 
                        label="24h Trades" 
                        value={marketData?.count ?? 'N/A'}
                        isLoading={isLoading}
                        icon={<LineChart size={16} className="text-muted-foreground" />}
                    />
                     <MarketStat 
                        label="ATH Price (99th Percentile)" 
                        value={athPriceData ?? 'N/A'} 
                        unit="USD"
                        isLoading={isLoading}
                        icon={<TrendingUp size={16} className="text-muted-foreground" />}
                    />
                    <MarketStat 
                        label="24h High Price" 
                        value={marketData?.Trade?.high ?? 'N/A'} 
                        unit="SOL"
                        isLoading={isLoading}
                        icon={<TrendingUp size={16} className="text-muted-foreground" />}
                    />
                    <MarketStat 
                        label="24h Low Price" 
                        value={marketData?.Trade?.low ?? 'N/A'} 
                        unit="SOL"
                        isLoading={isLoading}
                        icon={<TrendingUp size={16} className="text-muted-foreground rotate-180" />}
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
                 {!isLoading && athPriceData === null && !athFetchError && (
                     <p className="text-xs text-muted-foreground text-right mt-1">ATH data currently unavailable.</p>
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
                        icon={<DollarSign size={16} className="text-muted-foreground" />}
                    />
                    <MarketStat 
                        label="SOL Volume (from ECOHO Sales)" 
                        value={liquidityData?.wsolLiquidity ?? 'N/A'} 
                        unit="SOL"
                        isLoading={isLoading}
                        isMonthly={true}
                        icon={<DollarSign size={16} className="text-muted-foreground" />}
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
           {!isLoading && !marketData && !liquidityData && !athPriceData && !displayError && (
             <p className="text-sm text-muted-foreground p-4 text-center">No market data available at the moment.</p>
           )}
        </div>
      ) }
    </SectionCard>
  );
};

export default MarketAnalytics;
