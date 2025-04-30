import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenTransfers } from "../../tools/tokens/get_token_transfers";
import {
  GetTokenTransfersInput,
  GetTokenTransfersResponse,
} from "../../types/tokens/get_token_transfers";

/**
 * Action to fetch token transfers on Solana with filters like mint, sender, receiver, time, amount.
 */
const getTokenTransfersAction: Action = {
  name: "GET_VYBE_TOKEN_TRANSFERS",
  description: "Fetch token transfers with filtering options like mint, sender, receiver, time, and amount.",
  similes: [
    "Show recent SEND token transfers",
    "Get token movements between two addresses",
    "List all transfers of a mint in last 7 days",
    "Find top value token transfers",
    "Fetch transfers with high USD value",
  ],
  examples: [
    [
      {
        input: {
          mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
          limit: 5,
        },
        output: {
          status: "success",
          result: {
            count: 5,
            transfers: [
              {
                signature: "4JAT1d73tZ9mWu...",
                senderAddress: "CV6LvzL...",
                receiverAddress: "8L26HZx...",
                calculatedAmount: "150.0",
                valueUsd: "2.18",
                blockTime: 1745840875,
              },
            ],
          },
        },
        explanation: "Fetches top 5 SEND token transfer transactions",
      },
    ],
  ],
  schema: z.object({
    mintAddress: z.string().optional(),
    signature: z.string().optional(),
    callingProgram: z.string().optional(),
    senderTokenAccount: z.string().optional(),
    senderAddress: z.string().optional(),
    receiverTokenAccount: z.string().optional(),
    receiverAddress: z.string().optional(),
    feePayer: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    timeStart: z.number().optional(),
    timeEnd: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sortByAsc: z.enum(["amount", "slot", "blockTime"]).optional(),
    sortByDesc: z.enum(["amount", "slot", "blockTime"]).optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetTokenTransfersInput;
      const result: GetTokenTransfersResponse = await getTokenTransfers(agent, parsedInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getTokenTransfersAction;
