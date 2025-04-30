import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramTransactionsTimeSeries } from "../../tools/programs/get_program_transactions_ts";
import {
  GetProgramTransactionsTSInput,
  GetProgramTransactionsTSResponse,
} from "../../types/programs/get_program_transactions_ts";

/**
 * Action to get transaction count time-series for a Solana program.
 */
const getProgramTransactionsTSAction: Action = {
  name: "GET_VYBE_PROGRAM_TRANSACTIONS_TS",
  description: "Fetch historical transaction count trend for a Solana program.",
  similes: [
    "Show tx trend for a Solana program",
    "Transaction volume over time for this program",
    "Plot tx activity for program",
    "Get transaction stats for a smart contract",
  ],
  examples: [
    [
      {
        input: {
          programAddress: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
          range: "7d",
        },
        output: {
          status: "success",
          result: {
            programId: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
            trend: [
              {
                transactionsCount: 1154343,
                blockTime: 1744588800,
                programId: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
              },
            ],
          },
        },
        explanation: "Returns transaction volume trend for the given program over 7 days",
      },
    ],
  ],
  schema: z.object({
    programAddress: z.string().min(32, "Program address required"),
    range: z
      .string()
      .regex(/^(?:[1-9]|[12][0-9]|30)[dh]$/, "Range must be like '7d' or '12h'"),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetProgramTransactionsTSInput;
      const result: GetProgramTransactionsTSResponse =
        await getProgramTransactionsTimeSeries(agent, parsedInput);

      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getProgramTransactionsTSAction;
