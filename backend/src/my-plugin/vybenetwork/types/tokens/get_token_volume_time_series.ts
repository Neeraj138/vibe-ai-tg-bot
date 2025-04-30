export interface GetTokenVolumeTimeSeriesInput {
    mintAddress: string;
    startTime?: number;
    endTime?: number;
    interval?: string;
    limit?: number;
    page?: number;
  }
  
  export interface TokenVolumeTimeSeriesEntry {
    amount: string;
    timeBucketStart: number;
    volume: string;
  }
  
  export interface GetTokenVolumeTimeSeriesResponse {
    data: TokenVolumeTimeSeriesEntry[];
  }
  