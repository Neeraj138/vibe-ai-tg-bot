export interface GetKnownProgramsInput {
    programId?: string;
    name?: string;
    labels?: string[];
    entityName?: string;
    entityId?: number;
    sortByAsc?: string;
    sortByDesc?: string;
  }
  
  export interface KnownProgram {
    programId: string;
    name: string | null;
    labels: string[];
    logoUrl: string | null;
    entityName: string | null;
    entityId: number | null;
    dateAdded: string;
    programDescription: string | null;
    siteUrl: string | null;
    twitterUrl: string | null;
    idlUrl: string | null;
    defiLlamaId: string | null;
    programDetail: string | null;
  }
  
  export interface GetKnownProgramsResponse {
    programs: KnownProgram[];
  }
  