export interface GetProgramActiveUsersInput {
    programAddress: string;
    days?: number;
    limit?: number;
    sortByAsc?: string;
    sortByDesc?: string;
}

export interface ActiveUser {
    wallet: string;
    instructions: number;
    transactions: number;
    programId: string;
}

export interface GetProgramActiveUsersResponse {
    programId: string;
    topUsersByTransactions: ActiveUser[];
    topUsersByInstructions: ActiveUser[];
    note: string;
}