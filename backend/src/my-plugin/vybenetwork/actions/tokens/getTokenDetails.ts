import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenDetails } from "../../tools/tokens/get_token_details";
import {
  GetTokenDetailsInput,
  GetTokenDetailsResponse,
} from "../../types/tokens/get_token_details";

/**
 * Action to fetch complete token information like price, supply, 24h volume, and more.
 */
const getTokenDetailsAction: Action = {
  name: "GET_VYBE_TOKEN_DETAILS",
  description: "Fetch details about a token on Solana including price, supply, marketcap, and 24-hour volume.",
  similes: [
    "Show me details about the SEND token",
    "Get marketcap and supply info for a token",
    "Fetch full info of a Solana token",
    "Find the latest price of a token",
    "Check how much volume happened for a token in the last 24 hours",
  ],
  examples: [
    [
      {
        input: {
          mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
        },
        output: {
          status: "success",
          result: {
            symbol: "SEND",
            name: "Send",
            price: 0.01376,
            marketCap: 13758545.88,
            tokenAmountVolume24h: 19173318.69,
            usdValueVolume24h: 265962.27,
          },
        },
        explanation: "Fetches basic price, marketcap, and volume info for the SEND token",
      },
    ],
  ],  
  schema: z.object({
    mintAddress: z.string().min(32),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetTokenDetailsInput;
      const result: GetTokenDetailsResponse = await getTokenDetails(agent, parsedInput);
      return { status: "success", result };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getTokenDetailsAction;
