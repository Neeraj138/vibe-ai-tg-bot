import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramActiveUsers } from "../../tools/programs/get_program_active_users";
import { GetProgramActiveUsersInput, GetProgramActiveUsersResponse } from "../../types/programs/program_active_users";

/**
 * Action to fetch top active users for a Solana program using Vybe Network.
 */
const getProgramActiveUsersAction: Action = {
  name: "GET_VYBE_PROGRAM_ACTIVE_USERS",
  description: "Fetch active users, transaction counts, and instruction counts for a Solana program.",
  similes: [
    "Who are the most active users of this program?",
    "Get top wallets interacting with a program",
    "Show program user activity",
    "Top program users on Solana",
    "Most transactions on this program"
  ],
  examples: [
    [
      {
        input: {
          programAddress: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
        },
        output: {
          status: "success",
          result: {
            programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
            topUsersByTransactions: [
              {
                wallet: "abc...",
                transactions: 25,
                instructions: 30,
                programId: "pyt..."
              }
            ],
            topUsersByInstructions: [
              {
                wallet: "xyz...",
                transactions: 24,
                instructions: 32,
                programId: "pyt..."
              }
            ],
            note: "Stats shown are based on the first 1000 active users returned by Vybe and may not reflect the full activity of the program."
          }
        },
        explanation: "Returns top active wallets interacting with this program"
      }
    ]
  ],
  schema: z.object({
    programAddress: z.string().min(32, "Program address is required"),
    days: z.number().optional(),
    limit: z.number().optional(),
    sortByAsc: z.string().optional(),
    sortByDesc: z.string().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const result: GetProgramActiveUsersResponse = await getProgramActiveUsers(agent, input as GetProgramActiveUsersInput);
      return {
        status: "success",
        result,
      };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getProgramActiveUsersAction;
