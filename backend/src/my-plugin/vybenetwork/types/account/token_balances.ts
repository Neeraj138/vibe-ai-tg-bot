export interface GetTokenBalancesInput {
    ownerAddress: string;
    includeNoPriceBalance?: boolean;
    sortByAsc?: string;
    sortByDesc?: string;
    onlyVerified?: boolean;
    oneDayTradeMinimum?: number;
    oneDayTradeVolumeMinimum?: number;
    holderMinimum?: number;
    minAssetValue?: string;
    maxAssetValue?: string;
    limit?: number;
    page?: number;
  }
  
  export interface TokenBalance {
    symbol: string | null;
    name: string | null;
    mintAddress: string;
    amount: string;
    priceUsd: string;
    priceUsd1dChange: string;
    priceUsd7dTrend: string[] | string;
    valueUsd: string;
    valueUsd1dChange: string;
    logoUrl: string | null;
    category: string | null;
    decimals: number;
    verified: boolean;
    slot: number;
  }
  
  export interface GetTokenBalancesResponse {
    ownerAddress: string;
    date: number;
    totalTokenCount: number;
    totalTokenValueUsd: string;
    totalTokenValueUsd1dChange: string;
    stakedSolBalance: string;
    stakedSolBalanceUsd: string;
    activeStakedSolBalance: string;
    activeStakedSolBalanceUsd: string;
    data: TokenBalance[];
  }
  