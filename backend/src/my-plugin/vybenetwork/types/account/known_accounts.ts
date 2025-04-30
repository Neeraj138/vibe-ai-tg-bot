export interface GetKnownAccountsInput {
    ownerAddress?: string;
    name?: string;
    labels?: string[];
    entityName?: string;
    entityId?: number;
    sortByAsc?: string;
    sortByDesc?: string;
}

export interface KnownAccount {
    ownerAddress: string;
    name: string;
    logoUrl: string;
    labels: string[];
    entity: string;
    entityId: number | null;
    twitterUrl: string | null;
    dateAdded: string; // ISO string
}

export interface GetKnownAccountsResponse {
    accounts: KnownAccount[];
}
