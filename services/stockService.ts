/**
 * Fetches real-time prices for Cryptocurrencies using the CoinGecko Public API.
 */

const SYMBOL_TO_ID: Record<string, string> = {
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

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  const upperSymbol = symbol.toUpperCase().trim();
  const coinId = SYMBOL_TO_ID[upperSymbol] || upperSymbol.toLowerCase();

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) throw new Error('Network response was not ok');
    
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

export const fetchPrice = fetchCryptoPrice;
