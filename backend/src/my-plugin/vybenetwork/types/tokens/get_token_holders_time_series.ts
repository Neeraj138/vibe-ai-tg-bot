export interface GetTokenHoldersTimeSeriesInput {
    mintAddress: string;
    startTime?: number;
    endTime?: number;
    interval?: "day";
    limit?: number;
    page?: number;
  }
  
  export interface TokenHolderRecord {
    holdersTimestamp: number;
    nHolders: number;
  }
  
  export interface GetTokenHoldersTimeSeriesResponse {
    data: TokenHolderRecord[];
  }
  