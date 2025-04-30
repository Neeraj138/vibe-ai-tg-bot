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
const get_token_balances_1 = require("../../tools/account/get_token_balances");
/**
 * Action to fetch SPL token balances from Vybe Network.
 * Truncates to top 10 tokens by value and summarizes the wallet.
 */
const getTokenBalancesAction = {
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
                        summary: "Wallet J6iL... holds:\n" +
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
    schema: zod_1.z.object({
        ownerAddress: zod_1.z.string().min(32),
        includeNoPriceBalance: zod_1.z.boolean().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
        onlyVerified: zod_1.z.boolean().optional(),
        oneDayTradeMinimum: zod_1.z.number().optional(),
        oneDayTradeVolumeMinimum: zod_1.z.number().optional(),
        holderMinimum: zod_1.z.number().optional(),
        minAssetValue: zod_1.z.string().optional(),
        maxAssetValue: zod_1.z.string().optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_balances_1.getTokenBalances)(agent, parsedInput);
            const sorted = [...result.data].sort((a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd));
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
            const summary = `Wallet ${result.ownerAddress.slice(0, 4)}... holds:\n` +
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
        }
        catch (e) {
            return {
                status: "error",
                message: e.message,
            };
        }
    }),
};
exports.default = getTokenBalancesAction;
//# sourceMappingURL=getTokenBalances.js.map