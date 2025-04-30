import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenVolumeTimeSeries } from "../../tools/tokens/get_token_volume_time_series";
import {
  GetTokenVolumeTimeSeriesInput,
  GetTokenVolumeTimeSeriesResponse,
} from "../../types/tokens/get_token_volume_time_series";

/**
 * Action to retrieve token transfer volume time series.
 */
const getTokenVolumeTimeSeriesAction: Action = {
  name: "GET_VYBE_TOKEN_VOLUME_TIME_SERIES",
  description: "Retrieve token transfer volume in USD and token amount over a selected time period.",
  similes: [
    "Show SEND token transfer volume over the past week",
    "Get daily volume for a token",
    "Show how much a token was transferred recently",
    "Token transfer trends in USD",
  ],
  examples: [
    [
      {
        input: {
          mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
          startTime: 1745782470,
          endTime: 1745868870,
          limit: 10,
        },
        output: {
          status: "success",
          result: {
            data: [
              {
                timeBucketStart: 1745712000,
                volume: "25381.98417454587443275396",
                amount: "1824978.969166",
              },
              {
                timeBucketStart: 1745798400,
                volume: "508790.52322773806620207602",
                amount: "36698335.827200",
              },
            ],
          },
        },
        explanation: "Fetches token transfer volume (both amount and USD) for the SEND token within the specified time range.",
      },
    ],
  ],
  
  schema: z.object({
    mintAddress: z.string().min(32),
    startTime: z.number().optional(),
    endTime: z.number().optional(),
    interval: z.string().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetTokenVolumeTimeSeriesInput;
      const result: GetTokenVolumeTimeSeriesResponse = await getTokenVolumeTimeSeries(agent, parsedInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getTokenVolumeTimeSeriesAction;
