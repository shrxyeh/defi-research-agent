import axios from 'axios';

/**
 * Retrieves token information from CoinGecko API
 * @param tokenId The CoinGecko ID of the token (e.g., bitcoin, ethereum)
 * @returns JSON string with token data or error information
 */
export async function getTokenInfo(tokenId: string): Promise<string> {
  try {
    // Call CoinGecko API - using free endpoint with rate limiting
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    const data = response.data;
    
    // Extract relevant information
    const info = {
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      current_price: {
        usd: data.market_data.current_price.usd,
        btc: data.market_data.current_price.btc,
      },
      market_cap: {
        usd: data.market_data.market_cap.usd,
      },
      market_cap_rank: data.market_data.market_cap_rank,
      price_change_24h_percentage: data.market_data.price_change_percentage_24h,
      price_change_7d_percentage: data.market_data.price_change_percentage_7d,
      price_change_30d_percentage: data.market_data.price_change_percentage_30d,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      max_supply: data.market_data.max_supply,
      ath: data.market_data.ath.usd,
      ath_date: data.market_data.ath_date.usd,
    };
    
    return JSON.stringify(info);
  } catch (error) {
    console.error('Error fetching token info:', error);
    return JSON.stringify({ 
      error: 'Unable to fetch token information',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}