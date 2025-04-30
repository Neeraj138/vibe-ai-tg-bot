export interface GetProgramTvlTSInput {
    programAddress: string;
    resolution: "1h" | "1d" | "1w" | string; // Must be parseable to seconds
}

export interface ProgramTvlTS {
    time: string; // ISO timestamp
    tvl: string;  // TVL in USD as string
}

export interface GetProgramTvlTSResponse {
    programId: string;
    trend: ProgramTvlTS[];
}
