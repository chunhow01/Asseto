/**
 * Fetches real-time prices for Cryptocurrencies (CoinGecko) and US Stocks (Finnhub).
 */

// --- INSERT YOUR FINNHUB API KEY HERE ---
const HARDCODED_FINNHUB_KEY = 'YOUR_FINNHUB_API_KEY_HERE';

const SYMBOL_TO_CRYPTO_ID: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'MATIC': 'polygon',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'LTC': 'litecoin',
  'SHIB': 'shiba-inu',
  'BCH': 'bitcoin-cash',
  'XLM': 'stellar',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'ETC': 'ethereum-classic',
};

/**
 * Gets the API Key from localStorage or falls back to the hardcoded one.
 */
const getFinnhubKey = () => {
  const savedKey = localStorage.getItem('asseto_finnhub_key');
  return savedKey || HARDCODED_FINNHUB_KEY;
};

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  const upperSymbol = symbol.toUpperCase().trim();
  const coinId = SYMBOL_TO_CRYPTO_ID[upperSymbol] || upperSymbol.toLowerCase();

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { method: 'GET', headers: { 'Accept': 'application/json' } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data[coinId] && typeof data[coinId].usd === 'number') {
      return data[coinId].usd;
    }
    return null;
  } catch (e) {
    console.error(`CoinGecko fetch failed for ${upperSymbol}:`, e);
    return null;
  }
};

export const fetchStockPrice = async (symbol: string): Promise<number | null> => {
  const upperSymbol = symbol.toUpperCase().trim();
  const apiKey = getFinnhubKey();

  if (!apiKey || apiKey === 'YOUR_FINNHUB_API_KEY_HERE') {
    console.warn("Finnhub API Key is missing.");
    return null;
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${upperSymbol}&token=${apiKey}`
    );
    if (!response.ok) throw new Error('Finnhub response error');
    const data = await response.json();
    
    // Finnhub returns 'c' for current price. 
    // If symbol is invalid, 'c' is usually 0.
    if (data.c && data.c > 0) {
      return data.c;
    }
    return null;
  } catch (e) {
    console.error(`Finnhub fetch failed for ${upperSymbol}:`, e);
    return null;
  }
};

/**
 * Unified fetcher that decides whether to use CoinGecko or Finnhub.
 */
export const fetchPrice = async (symbol: string): Promise<number | null> => {
  const upperSymbol = symbol.toUpperCase().trim();
  
  // If it's in our known crypto list, try Crypto first.
  if (SYMBOL_TO_CRYPTO_ID[upperSymbol]) {
    const cryptoPrice = await fetchCryptoPrice(upperSymbol);
    if (cryptoPrice) return cryptoPrice;
  }

  // Otherwise, try Finnhub for Stock
  const stockPrice = await fetchStockPrice(upperSymbol);
  if (stockPrice) return stockPrice;

  // Final fallback: try Crypto one more time in case it's a new altcoin not in the list
  return await fetchCryptoPrice(upperSymbol);
};