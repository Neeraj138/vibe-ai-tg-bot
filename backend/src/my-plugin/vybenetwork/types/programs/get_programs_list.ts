export interface GetProgramsListInput {
    labels?: string[];       // e.g., ['DEFI', 'NFT']
    limit?: number;
    page?: number;
    sortByAsc?: string;
    sortByDesc?: string;
  }
  
  export interface ProgramListItem {
    programId: string;
    name: string | null;
    friendlyName: string | null;
    logoUrl: string | null;
    labels: string[];
    dau: number | null;
    transactions1d: number | null;
    instructions1d: number | null;
    newUsersChange1d: number | null;
    idlUrl: string | null;
    programDescription: string | null;
    programDetail: string | null;
    entityName: string | null;
  }
  
  export interface GetProgramsListResponse {
    count: number;
    programs: ProgramListItem[];
  }
  