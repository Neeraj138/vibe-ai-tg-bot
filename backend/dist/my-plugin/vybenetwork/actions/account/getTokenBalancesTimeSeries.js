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
const get_token_balances_timeseries_1 = require("../../tools/account/get_token_balances_timeseries");
/**
 * Action to get token balance time-series from Vybe Network.
 */
const getTokenBalancesTimeSeriesAction = {
    name: "GET_VYBE_TOKEN_BALANCE_TIMESERIES",
    description: "Get historical SOL, staked SOL, and SPL token balances in USD for a wallet.",
    similes: [
        "show my token balance time-series",
        "how has my wallet value changed?",
        "historical sol token balances",
        "show wallet token value chart",
        "how much was my wallet worth over the last few days?",
        "solana portfolio trend over time",
        "display wallet history",
        "give me the last 10 days wallet balance trend",
    ],
    examples: [
        [
            {
                input: {
                    ownerAddress: "FYuDtwSJ1JjngZZpywMZc6DLNS8YmQdRR1Y45wEB14Gp",
                    days: 7,
                },
                output: {
                    status: "success",
                    result: {
                        summary: "Over the last 7 days, your token value increased from $29.60 to $199.37",
                        latestSnapshot: {
                            date: "2025-04-20",
                            tokenValue: "$199.38",
                            systemValue: "$12.44",
                            stakeValue: "$0.00",
                        },
                        data: [
                            {
                                date: "2025-04-15",
                                tokenValue: "$25.77",
                                systemValue: "$3.58",
                            },
                            {
                                date: "2025-04-16",
                                tokenValue: "$24.84",
                                systemValue: "$3.31",
                            },
                            {
                                date: "2025-04-17",
                                tokenValue: "$51.66",
                                systemValue: "$3.47",
                            },
                            // ...up to 7 records
                        ],
                    },
                },
                explanation: "Summarizes wallet balance trends over the last 7 days",
            },
        ],
    ],
    schema: zod_1.z.object({
        ownerAddress: zod_1.z.string().min(32, "Invalid wallet address"),
        days: zod_1.z.number().min(1).max(30).optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_balances_timeseries_1.getTokenBalancesTimeSeries)(agent, parsedInput);
            // 🧮 Structure the result summary
            const snapshots = result.data.slice(-7); // latest 7 days (or less)
            const first = snapshots[0];
            const last = snapshots[snapshots.length - 1];
            return {
                status: "success",
                result: {
                    summary: `Over the last ${snapshots.length} days, your token value changed from $${parseFloat(first.tokenValue).toFixed(2)} to $${parseFloat(last.tokenValue).toFixed(2)}`,
                    latestSnapshot: {
                        date: new Date(last.blockTime * 1000).toISOString().split("T")[0],
                        tokenValue: `$${parseFloat(last.tokenValue).toFixed(2)}`,
                        systemValue: `$${parseFloat(last.systemValue).toFixed(2)}`,
                        stakeValue: `$${parseFloat(last.stakeValue).toFixed(2)}`,
                    },
                    data: snapshots.map((point) => ({
                        date: new Date(point.blockTime * 1000).toISOString().split("T")[0],
                        tokenValue: `$${parseFloat(point.tokenValue).toFixed(2)}`,
                        systemValue: `$${parseFloat(point.systemValue).toFixed(2)}`,
                    })),
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
exports.default = getTokenBalancesTimeSeriesAction;
//# sourceMappingURL=getTokenBalancesTimeSeries.js.map