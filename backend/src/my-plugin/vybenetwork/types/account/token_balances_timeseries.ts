export interface GetTokenBalancesTimeSeriesInput {
    ownerAddress: string;
    days?: number;
}

export interface TokenBalancePoint {
    blockTime: number;
    stakeValue: string;
    stakeValueSol: string;
    systemValue: string;
    tokenValue: string;
}

export interface GetTokenBalancesTimeSeriesResponse {
    ownerAddress: string;
    data: TokenBalancePoint[];
}
