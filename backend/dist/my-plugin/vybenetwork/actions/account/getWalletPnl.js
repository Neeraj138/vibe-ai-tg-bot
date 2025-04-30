"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const get_wallet_pnl_1 = require("../../tools/account/get_wallet_pnl");
/**
 * Action to fetch wallet trading PnL insights
 */
const getWalletPnlAction = {
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
    schema: zod_1.z.object({
        ownerAddress: zod_1.z.string().min(32),
        resolution: zod_1.z.enum(["1d", "7d", "30d"]).optional(),
        tokenAddress: zod_1.z.string().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_wallet_pnl_1.getWalletPnl)(agent, parsedInput);
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
                    bestToken: (topToken === null || topToken === void 0 ? void 0 : topToken.tokenSymbol) || "N/A",
                    trades,
                },
            };
        }
        catch (e) {
            return {
                status: "error",
                message: e.message,
            };
        }
    }),
};
exports.default = getWalletPnlAction;
//# sourceMappingURL=getWalletPnl.js.map