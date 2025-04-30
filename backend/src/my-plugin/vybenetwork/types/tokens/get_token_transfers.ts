export interface GetTokenTransfersInput {
    mintAddress?: string;
    signature?: string;
    callingProgram?: string;
    senderTokenAccount?: string;
    senderAddress?: string;
    receiverTokenAccount?: string;
    receiverAddress?: string;
    feePayer?: string;
    minAmount?: number;
    maxAmount?: number;
    timeStart?: number;
    timeEnd?: number;
    page?: number;
    limit?: number;
    sortByAsc?: "amount" | "slot" | "blockTime";
    sortByDesc?: "amount" | "slot" | "blockTime";
  }
  
  export interface TokenCallingMetadata {
    callingInstructions: number[];   // array of numbers
    callingProgram: string;
    ixName: string;
    programName: string;
  }
  
  export interface TokenTransfer {
    amount: number;
    blockTime: number;
    calculatedAmount: string;
    callingMetadata: TokenCallingMetadata[];
    decimal: number;
    feePayer: string;
    mintAddress: string;
    price: string;
    receiverAddress: string | null;
    receiverTokenAccount: string | null;
    senderAddress: string;
    senderTokenAccount: string | null;
    signature: string;
    slot: number;
    valueUsd: string;
  }
  
  export interface GetTokenTransfersResponse {
    count: number;
    transfers: TokenTransfer[];
  }
  