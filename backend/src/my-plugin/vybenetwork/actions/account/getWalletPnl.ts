import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getWalletPnl } from "../../tools/account/get_wallet_pnl";
import { WalletPnlInput, WalletPnlResponse } from "../../types/account/wallet_pnl";

/**
 * Action to fetch wallet trading PnL insights
 */
const getWalletPnlAction: Action = {
  name: "GET_VYBE_WALLET_PNL",
  description: "Get wallet trading performance including realized and unrealized PnL, win rate, and best/worst tokens.",
  similes: [
    "How much profit did this wallet make?",
    "Get trading PnL for this wallet",
    "Show realized and unrealized PnL from Vybe",
  ],
  examples: [
    [
      {
        input: {
          ownerAddress: "FYuDtwSJ1JjngZZpywMZc6DLNS8YmQdRR1Y45wEB14Gp",
          resolution: "30d",
        },
        output: {
          status: "success",
          summary: {
            realizedPnlUsd: 16.49,
            unrealizedPnlUsd: 0.00,
            winRate: 83.33,
            bestToken: "Thronglets",
            tradesCount: 6,
          },
        },
        explanation: "Returns trading performance for 30d including PnL and win rate",
      },
    ],
  ],
  schema: z.object({
    ownerAddress: z.string().min(32),
    resolution: z.enum(["1d", "7d", "30d"]).optional(),
    tokenAddress: z.string().optional(),
    sortByAsc: z.string().optional(),
    sortByDesc: z.string().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as WalletPnlInput;
      const result: WalletPnlResponse = await getWalletPnl(agent, parsedInput);

      const summary = result.summary;
      const topToken = summary.bestPerformingToken;
      const trades = result.tokenMetrics.slice(0, 5).map((t) => ({
        symbol: t.tokenSymbol,
        realized: t.realizedPnlUsd,
        buys: t.buys.volumeUsd,
        sells: t.sells.volumeUsd,
      }));

      return {
        status: "success",
        summary: {
          realizedPnlUsd: summary.realizedPnlUsd.toFixed(2),
          unrealizedPnlUsd: summary.unrealizedPnlUsd.toFixed(2),
          winRate: summary.winRate.toFixed(2),
          tradesCount: summary.tradesCount,
          bestToken: topToken?.tokenSymbol || "N/A",
          trades,
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

export default getWalletPnlAction;
