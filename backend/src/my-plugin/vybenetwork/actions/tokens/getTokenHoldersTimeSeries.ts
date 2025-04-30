import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenHoldersTimeSeries } from "../../tools/tokens/get_token_holders_time_series";
import {
  GetTokenHoldersTimeSeriesInput,
  GetTokenHoldersTimeSeriesResponse,
} from "../../types/tokens/get_token_holders_time_series";

/**
 * Action to fetch the number of token holders over a given period.
 */
const getTokenHoldersTimeSeriesAction: Action = {
  name: "GET_VYBE_TOKEN_HOLDERS_TIME_SERIES",
  description: "Retrieve the daily time series of token holders for a specific token on Solana.",
  similes: [
    "Show me how many people hold the SEND token over time",
    "Get the daily holders count for a token",
    "Fetch time series data of token holders",
    "How is the number of holders trending for SEND?",
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
            holders: [
              {
                holdersTimestamp: 1744664400,
                nHolders: 15671,
              },
              {
                holdersTimestamp: 1744675200,
                nHolders: 15082,
              },
            ],
          },
        },
        explanation: "Fetches the latest 5 daily holder counts for the SEND token",
      },
    ],
  ],
  schema: z.object({
    mintAddress: z.string().min(32),
    startTime: z.number().optional(),
    endTime: z.number().optional(),
    interval: z.enum(["day"]).optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetTokenHoldersTimeSeriesInput;
      const result: GetTokenHoldersTimeSeriesResponse = await getTokenHoldersTimeSeries(agent, parsedInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getTokenHoldersTimeSeriesAction;
