export interface GetTokenDetailsInput {
    mintAddress: string;
  }
  
  export interface GetTokenDetailsResponse {
    symbol: string;
    name: string | null;
    mintAddress: string;
    price: number;
    price1d: number;
    price7d: number;
    decimal: number;
    logoUrl: string | null;
    category: string | null;
    subcategory: string | null;
    verified: boolean;
    updateTime: number;
    currentSupply: number;
    marketCap: number;
    tokenAmountVolume24h: number | null;
    usdValueVolume24h: number | null;
  }
  