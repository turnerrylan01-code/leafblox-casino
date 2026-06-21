interface SolanaPriceResponse {
  solana: {
    usd: number;
  };
}

let cachedPrice: number | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export async function getSolanaPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if still valid
  if (cachedPrice && now - lastFetch < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data: SolanaPriceResponse = await response.json();
    
    if (data.solana?.usd) {
      cachedPrice = data.solana.usd;
      lastFetch = now;
      return cachedPrice;
    }
    
    // Fallback to cached price if API fails
    return cachedPrice || 150; // Default fallback price
  } catch (error) {
    console.error('Failed to fetch Solana price:', error);
    return cachedPrice || 150; // Fallback price
  }
}

export function solToUsd(solAmount: number, price: number): number {
  return solAmount * price;
}

export function usdToSol(usdAmount: number, price: number): number {
  return usdAmount / price;
}
