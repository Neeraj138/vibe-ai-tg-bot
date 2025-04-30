import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getKnownPrograms } from "../../tools/programs/get_known_programs";
import {
  GetKnownProgramsInput,
  GetKnownProgramsResponse,
} from "../../types/programs/known_programs";

const getKnownProgramsAction: Action = {
  name: "GET_KNOWN_VYBE_PROGRAMS",
  description: "Fetch categorized Solana program accounts from Vybe Network.",
  similes: [
    "Show me popular programs on Solana",
    "What are some DeFi programs?",
    "List NFT program IDs",
    "Fetch known Solana protocols",
    "Give me Solana infra programs"
  ],
  examples: [
    [
      {
        input: {
          labels: ["NFT", "GAMING"],
        },
        output: {
          status: "success",
          programs: [
            {
              programId: "xxxx...",
              name: "Star Atlas",
              labels: ["GAMING"]
            }
          ],
        },
        explanation: "Fetches NFT and GAMING program accounts on Solana",
      },
    ],
  ],
  schema: z.object({
    programId: z.string().optional(),
    name: z.string().optional(),
    labels: z.array(z.string()).optional(),
    entityName: z.string().optional(),
    entityId: z.number().optional(),
    sortByAsc: z.string().optional(),
    sortByDesc: z.string().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const result: GetKnownProgramsResponse = await getKnownPrograms(agent, input as GetKnownProgramsInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getKnownProgramsAction;
