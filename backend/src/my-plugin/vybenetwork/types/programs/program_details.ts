export interface GetProgramDetailsInput {
    programAddress: string;
  }
  
  export interface GetProgramDetailsResponse {
    programId: string;
    name: string | null;
    labels: string[] | null;
    transactions1d: number | null;
    dau: number | null;
    entityName: string | null;
    programDescription: string | null;
  }
  