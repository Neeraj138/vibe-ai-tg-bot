import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenBalances } from "../../tools/account/get_token_balances";
import {
  GetTokenBalancesInput,
  GetTokenBalancesResponse,
} from "../../types/account/token_balances";

/**
 * Action to fetch SPL token balances from Vybe Network.
 * Truncates to top 10 tokens by value and summarizes the wallet.
 */
const getTokenBalancesAction: Action = {
  name: "GET_VYBE_TOKEN_BALANCES",
  description: "Get SPL token balances of a Solana wallet, including portfolio stats.",
  similes: [
    "Get wallet token holdings",
    "What tokens does this address hold?",
    "Show SPL portfolio breakdown",
  ],
  examples: [
    [
      {
        input: {
          ownerAddress: "J6iLH9WBxW4JPGjLhRDyCRqcEWEvp1b1uhJsNhYYEs3r",
        },
        output: {
          status: "success",
          result: {
            summary:
              "Wallet J6iL... holds:\n" +
              "- SOL: 0.08 (≈ $10.47)\n" +
              "- SEND: 100 (≈ $10.12)\n\n" +
              "Total value: $20.59",
            note: "Only showing top 10 tokens to fit model limits",
          },
        },
        explanation: "Returns a wallet’s token holdings summarized with amounts and value",
      },
    ],
  ],
  schema: z.object({
    ownerAddress: z.string().min(32),
    includeNoPriceBalance: z.boolean().optional(),
    sortByAsc: z.string().optional(),
    sortByDesc: z.string().optional(),
    onlyVerified: z.boolean().optional(),
    oneDayTradeMinimum: z.number().optional(),
    oneDayTradeVolumeMinimum: z.number().optional(),
    holderMinimum: z.number().optional(),
    minAssetValue: z.string().optional(),
    maxAssetValue: z.string().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetTokenBalancesInput;
      const result: GetTokenBalancesResponse = await getTokenBalances(agent, parsedInput);

      const sorted = [...result.data].sort(
        (a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd)
      );
      const topTokens = sorted.slice(0, 10);

      const summaryLines = topTokens.map((token) => {
        const symbol = token.symbol || token.name || token.mintAddress.slice(0, 4);
        const amount = parseFloat(token.amount).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
        const value = parseFloat(token.valueUsd).toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        });
        return `- ${symbol}: ${amount} (≈ ${value})`;
      });

      const summary =
        `Wallet ${result.ownerAddress.slice(0, 4)}... holds:\n` +
        summaryLines.join("\n") +
        `\n\nTotal value: $${parseFloat(result.totalTokenValueUsd).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`;

      return {
        status: "success",
        result: {
          summary,
          note: result.data.length > 10 ? "Only showing top 10 tokens to fit model limits" : undefined,
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

export default getTokenBalancesAction;
