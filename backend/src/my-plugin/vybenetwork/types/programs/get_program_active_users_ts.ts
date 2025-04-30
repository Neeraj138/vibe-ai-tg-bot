export interface GetProgramActiveUsersTSInput {
    programAddress: string;
    range: string; // e.g., "7d", "24h"
  }
  
  export interface ProgramActiveUsersTS {
    programId: string;
    dau: number;
    blockTime: number;
  }
  
  export interface GetProgramActiveUsersTSResponse {
    programId: string;
    trend: ProgramActiveUsersTS[];
  }
  