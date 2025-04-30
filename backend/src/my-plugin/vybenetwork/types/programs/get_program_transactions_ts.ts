export interface GetProgramTransactionsTSInput {
    programAddress: string;
    range: string; // e.g. "7d", "24h"
}

export interface ProgramTransactionsTS {
    programId: string;
    transactionsCount: number;
    blockTime: number;
}

export interface GetProgramTransactionsTSResponse {
    programId: string;
    trend: ProgramTransactionsTS[];
}
