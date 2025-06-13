/**
 * Service for fetching cryptocurrency price data
 */

// Cache for price data to avoid excessive API calls
interface PriceCache {
  [symbol: string]: {
    usd: number;
    usd_24h_change: number;
    last_updated: number;
  };
}

// Price history point
interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

// Cache for price data
const priceCache: PriceCache = {};
// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Mock price history data (for demo purposes)
const mockPriceHistory: { [symbol: string]: PriceHistoryPoint[] } = {
  'ethereum': generateMockPriceHistory(2500, 30),
  'bitcoin': generateMockPriceHistory(40000, 30),
  'dai': generateMockPriceHistory(1, 30),
  'usd-coin': generateMockPriceHistory(1, 30),
  'chainlink': generateMockPriceHistory(15, 30),
};

/**
 * Generate mock price history data
 * @param basePrice Base price to generate history around
 * @param days Number of days of history to generate
 * @returns Array of price history points
 */
function generateMockPriceHistory(basePrice: number, days: number): PriceHistoryPoint[] {
  const now = Date.now();
  const history: PriceHistoryPoint[] = [];
  
  // Generate one point per day
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    // Add some random variation to the price
    const variation = (Math.random() - 0.5) * 0.1; // +/- 5%
    const price = basePrice * (1 + variation);
    
    history.push({
      timestamp,
      price
    });
  }
  
  return history;
}

/**
 * Get the current price of a cryptocurrency
 * @param symbol The cryptocurrency symbol (e.g., 'ethereum', 'bitcoin')
 * @returns Price data including current price and 24h change
 */
export const getPrice = async (symbol: string): Promise<{ usd: number; usd_24h_change: number }> => {
  // Convert symbol to lowercase and handle special cases
  const normalizedSymbol = symbol.toLowerCase();
  const coingeckoId = 
    normalizedSymbol === 'eth' ? 'ethereum' :
    normalizedSymbol === 'btc' ? 'bitcoin' :
    normalizedSymbol === 'link' ? 'chainlink' :
    normalizedSymbol === 'usdc' ? 'usd-coin' :
    normalizedSymbol === 'dai' ? 'dai' :
    normalizedSymbol;
  
  // Check cache first
  if (
    priceCache[coingeckoId] && 
    Date.now() - priceCache[coingeckoId].last_updated < CACHE_TTL
  ) {
    return {
      usd: priceCache[coingeckoId].usd,
      usd_24h_change: priceCache[coingeckoId].usd_24h_change
    };
  }
  
  try {
    // In a real app, you would fetch from CoinGecko or similar API
    // For demo purposes, we'll use mock data
    let price: number;
    let change: number;
    
    switch (coingeckoId) {
      case 'ethereum':
        price = 2500 + (Math.random() - 0.5) * 100;
        change = (Math.random() - 0.5) * 10;
        break;
      case 'bitcoin':
        price = 40000 + (Math.random() - 0.5) * 1000;
        change = (Math.random() - 0.5) * 8;
        break;
      case 'chainlink':
        price = 15 + (Math.random() - 0.5) * 1;
        change = (Math.random() - 0.5) * 12;
        break;
      case 'usd-coin':
      case 'dai':
        price = 1 + (Math.random() - 0.5) * 0.01;
        change = (Math.random() - 0.5) * 0.5;
        break;
      default:
        price = 10 + (Math.random() - 0.5) * 1;
        change = (Math.random() - 0.5) * 15;
    }
    
    // Update cache
    priceCache[coingeckoId] = {
      usd: price,
      usd_24h_change: change,
      last_updated: Date.now()
    };
    
    return {
      usd: price,
      usd_24h_change: change
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw new Error(`Failed to fetch price for ${symbol}`);
  }
};

/**
 * Get price history for a cryptocurrency
 * @param symbol The cryptocurrency symbol
 * @param days Number of days of history to fetch
 * @returns Array of price history points
 */
export const getPriceHistory = async (
  symbol: string,
  days: number = 30
): Promise<PriceHistoryPoint[]> => {
  // Convert symbol to lowercase and handle special cases
  const normalizedSymbol = symbol.toLowerCase();
  const coingeckoId = 
    normalizedSymbol === 'eth' ? 'ethereum' :
    normalizedSymbol === 'btc' ? 'bitcoin' :
    normalizedSymbol === 'link' ? 'chainlink' :
    normalizedSymbol === 'usdc' ? 'usd-coin' :
    normalizedSymbol === 'dai' ? 'dai' :
    normalizedSymbol;
  
  try {
    // In a real app, you would fetch from CoinGecko or similar API
    // For demo purposes, we'll use mock data
    if (mockPriceHistory[coingeckoId]) {
      // Return only the requested number of days
      return mockPriceHistory[coingeckoId].slice(-days);
    }
    
    // If we don't have mock data for this symbol, generate some
    return generateMockPriceHistory(100, days);
  } catch (error) {
    console.error(`Error fetching price history for ${symbol}:`, error);
    throw new Error(`Failed to fetch price history for ${symbol}`);
  }
};

/**
 * Get prices for multiple cryptocurrencies
 * @param symbols Array of cryptocurrency symbols
 * @returns Object mapping symbols to price data
 */
export const getPrices = async (
  symbols: string[]
): Promise<{ [symbol: string]: { usd: number; usd_24h_change: number } }> => {
  try {
    const prices: { [symbol: string]: { usd: number; usd_24h_change: number } } = {};
    
    // Fetch prices for each symbol
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          prices[symbol] = await getPrice(symbol);
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
          prices[symbol] = { usd: 0, usd_24h_change: 0 };
        }
      })
    );
    
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw new Error('Failed to fetch prices');
  }
};

export default {
  getPrice,
  getPrices,
  getPriceHistory
};
