export interface GetNftBalancesInput {
    ownerAddress: string;
    includeNoPriceBalance?: boolean;
    sortByAsc?: string;
    sortByDesc?: string;
    limit?: number;
    page?: number;
  }
  
  export interface NftBalance {
    collectionAddress: string;
    logoUrl: string | null;
    name: string | null;
    priceSol: string;
    priceUsd: string;
    slot: number;
    totalItems: number;
    valueSol: string;
    valueUsd: string;
  }
  
  export interface GetNftBalancesResponse {
    date: number;
    ownerAddress: string;
    totalNftCollectionCount: number;
    totalSol: string;
    totalUsd: string;
    data: NftBalance[];
  }
  