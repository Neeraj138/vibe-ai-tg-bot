import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getProgramTvlTimeSeries } from "../../tools/programs/get_program_tvl_ts";
import {
  GetProgramTvlTSInput,
  GetProgramTvlTSResponse,
} from "../../types/programs/get_program_tvl_ts";

/**
 * Action to get historical TVL for a Solana program.
 */
const getProgramTvlTSAction: Action = {
  name: "GET_VYBE_PROGRAM_TVL_TS",
  description: "Fetch historical TVL (Total Value Locked) time series for a Solana program.",
  similes: [
    "Show TVL chart for this program",
    "Get historical TVL for a Solana program",
    "Track TVL performance of this contract",
    "Fetch TVL data over time for a dApp",
  ],
  examples: [
    [
      {
        input: {
          programAddress: "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
          resolution: "1d",
        },
        output: {
          status: "success",
          result: {
            programId: "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
            trend: [
              {
                tvl: "158283666.10072076150776730879",
                time: "2025-03-21T00:00:00Z",
              },
            ],
          },
        },
        explanation: "TVL history for the given program over daily resolution",
      },
    ],
  ],
  schema: z.object({
    programAddress: z.string().min(32, "Program address required"),
    resolution: z
      .string()
      .regex(/^(1[dhw]|[2-9][dhw]?|[1-9][0-9]+s)?$/, "Invalid resolution. Use '1d', '1h', '1w' etc."),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetProgramTvlTSInput;
      const result: GetProgramTvlTSResponse = await getProgramTvlTimeSeries(agent, parsedInput);

      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getProgramTvlTSAction;
