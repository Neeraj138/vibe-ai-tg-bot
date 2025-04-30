export interface GetTopTokenHoldersInput {
    mintAddress: string;
    page?: number;
    limit?: number;
    sortByAsc?: "rank" | "ownerName" | "ownerAddress" | "valueUsd" | "balance" | "percentageOfSupplyHeld";
    sortByDesc?: "rank" | "ownerName" | "ownerAddress" | "valueUsd" | "balance" | "percentageOfSupplyHeld";
  }
  
  export interface TopTokenHolder {
    balance: string;
    ownerAddress: string;
    ownerLogoUrl?: string | null;
    ownerName?: string | null;
    percentageOfSupplyHeld: number;
    rank: number;
    tokenLogoUrl?: string | null;
    tokenMint: string;
    tokenSymbol?: string | null;
    valueUsd: string;
  }
  
  export interface GetTopTokenHoldersResponse {
    data: TopTokenHolder[];
  }
  