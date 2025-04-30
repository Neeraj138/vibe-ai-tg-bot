import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramsList } from "../../tools/programs/get_programs_list";
import {
  GetProgramsListInput,
  GetProgramsListResponse,
} from "../../types/programs/get_programs_list";

/**
 * Action to get a union-list of Solana programs based on labels or popularity.
 */
const getProgramsListAction: Action = {
  name: "GET_VYBE_PROGRAMS_LIST",
  description: "Fetch a list of Solana programs that have IDLs on-chain. Sort by DAU, TXs, or labels.",
  similes: [
    "Show top defi or nft programs",
    "Get Solana programs with most users",
    "List all Solana programs by category",
    "Which dApps have IDLs on-chain?",
    "Find programs for DEFI, NFT, or ORACLE",
  ],
  examples: [
    [
      {
        input: {
          labels: ["defi", "nft"],
          limit: 5,
        },
        output: {
          status: "success",
          result: {
            count: 5,
            programs: [
              {
                programId: "24Uqj9JCLx...",
                name: "Meteora Vault Program",
                dau: 20508,
                transactions1d: 297026,
                instructions1d: 297487,
                labels: ["DEFI", "AMM"],
              },
            ],
          },
        },
        explanation: "Returns a union of programs with DEFI or NFT labels, limited to 5 results",
      },
    ],
  ],
  schema: z.object({
    labels: z.array(z.string()).optional(),
    limit: z.number().min(1).max(100).optional(),
    page: z.number().min(0).optional(),
    sortByAsc: z.enum(["dau", "name", "transactions1d", "instructions1d"]).optional(),
    sortByDesc: z.enum(["dau", "name", "transactions1d", "instructions1d"]).optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetProgramsListInput;
      const result: GetProgramsListResponse = await getProgramsList(agent, parsedInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getProgramsListAction;
