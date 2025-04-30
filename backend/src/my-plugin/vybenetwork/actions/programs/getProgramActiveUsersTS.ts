import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramActiveUsersTimeSeries } from "../../tools/programs/get_program_active_users_ts";
import {
  GetProgramActiveUsersTSInput,
  GetProgramActiveUsersTSResponse,
} from "../../types/programs/get_program_active_users_ts";

/**
 * Action to fetch active user trend (DAU time series) for a Solana program.
 */
const getProgramActiveUsersTSAction: Action = {
  name: "GET_VYBE_PROGRAM_ACTIVE_USERS_TS",
  description: "Get active user time series (DAU) for a given Solana program.",
  similes: [
    "Show DAU trend of a program",
    "Get active users over time",
    "Daily active users for a Solana program",
    "Solana program usage chart",
    "DAU stats for a Solana contract",
  ],
  examples: [
    [
      {
        input: {
          programAddress: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
          range: "7d",
        },
        output: {
          status: "success",
          result: {
            programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
            trend: [
              {
                dau: 589,
                blockTime: 1744588800,
                programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
              },
            ],
          },
        },
        explanation: "Returns DAU stats over the past 7 days for the given program",
      },
    ],
  ],
  schema: z.object({
    programAddress: z.string().min(32, "Valid program address required"),
    range: z
      .string()
      .regex(/^(?:[1-9]|[12][0-9]|30)[dh]$/, "Range must be like '7d' or '12h'"),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetProgramActiveUsersTSInput;
      const result: GetProgramActiveUsersTSResponse =
        await getProgramActiveUsersTimeSeries(agent, parsedInput);

      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default getProgramActiveUsersTSAction;
