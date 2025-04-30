import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramDetails } from "../../tools/programs/get_program_details";
import {
  GetProgramDetailsInput,
  GetProgramDetailsResponse,
} from "../../types/programs/program_details";

/**
 * Action for fetching program metadata using Vybe Network
 */
const getProgramDetailsAction: Action = {
  name: "GET_PROGRAM_DETAILS_VYBE",
  description: "Get 1-day transactions, DAU, name, and description of a Solana program",
  similes: [
    "Get program metadata",
    "Fetch program info from Vybe",
    "Tell me about a program",
    "Give me usage stats of this Solana program",
    "What is this program used for?",
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
            name: "Pyth Staking",
            labels: ["INFRA", "ORACLE", "DEFI"],
            transactions1d: 889,
            dau: 372,
            entityName: "Pyth Network",
            programDescription:
              "A staking protocol for participating in the Pyth Network, which provides high-fidelity financial data for smart contracts.",
          },
        },
        explanation: "Shows daily usage and info for Pyth program",
      },
    ],
  ],
  schema: z.object({
    programAddress: z.string().min(32),
  }),
  handler: async (agent, input) => {
    try {
      const result: GetProgramDetailsResponse = await getProgramDetails(agent, input as GetProgramDetailsInput);
      return {
        status: "success",
        result: {
          programId: result.programId,
          name: result.name,
          labels: result.labels,
          transactions1d: result.transactions1d,
          dau: result.dau,
          entityName: result.entityName,
          programDescription: result.programDescription,
        },
      };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getProgramDetailsAction;
