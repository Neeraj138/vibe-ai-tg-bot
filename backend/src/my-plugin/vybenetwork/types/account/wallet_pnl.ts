export interface WalletPnlInput {
    ownerAddress: string;
    resolution?: "1d" | "7d" | "30d";
    tokenAddress?: string;
    sortByAsc?: string;
    sortByDesc?: string;
    limit?: number;
    page?: number;
  }
  
  export interface TradeSideSummary {
    tokenAmount: number;
    transactionCount: number;
    volumeUsd: number;
  }
  
  export interface TokenPnlMetrics {
    tokenAddress: string;
    tokenSymbol: string;
    realizedPnlUsd: number;
    unrealizedPnlUsd: number;
    buys: TradeSideSummary;
    sells: TradeSideSummary;
  }
  
  export interface TokenSummary {
    pnlUsd: number;
    tokenAddress: string;
    tokenLogoUrl: string;
    tokenName: string;
    tokenSymbol: string;
  }
  
  export interface WalletPnlResponse {
    summary: {
      averageTradeUsd: number;
      realizedPnlUsd: number;
      unrealizedPnlUsd: number;
      tradesCount: number;
      tradesVolumeUsd: number;
      winningTradesCount: number;
      losingTradesCount: number;
      winRate: number;
      uniqueTokensTraded: number;
      pnlTrendSevenDays: number[][];
      bestPerformingToken?: TokenSummary;
      worstPerformingToken?: TokenSummary | null;
    };
    tokenMetrics: TokenPnlMetrics[];
  }
  