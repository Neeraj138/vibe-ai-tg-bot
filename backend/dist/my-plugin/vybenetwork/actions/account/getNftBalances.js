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
const get_nft_balances_1 = require("../../tools/account/get_nft_balances");
/**
 * Action to fetch NFT balances and summarize them.
 */
const getNftBalancesAction = {
    name: "GET_VYBE_NFT_BALANCES",
    description: "Get NFT collection holdings and value of a Solana wallet.",
    similes: [
        "What NFTs does this wallet hold?",
        "Get NFT collections for a wallet",
        "Show wallet NFT portfolio",
    ],
    examples: [
        [
            {
                input: {
                    ownerAddress: "CJLpcZn3RJt2zVUynmk4UxYujnWLPTvKvykiEQen8Zvh",
                },
                output: {
                    status: "success",
                    result: {
                        summary: "Wallet CJLp... holds 3 NFT collections worth $123.45.",
                        collections: [
                            "- Degods: 2 items (≈ $90.00)",
                            "- Mad Lads: 1 item (≈ $33.45)",
                        ],
                        note: "Only showing top 10 NFT collections",
                    },
                },
                explanation: "Summarizes top NFT holdings from Vybe API.",
            },
        ],
    ],
    schema: zod_1.z.object({
        ownerAddress: zod_1.z.string().min(32),
        includeNoPriceBalance: zod_1.z.boolean().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_nft_balances_1.getNftBalances)(agent, parsedInput);
            const sorted = [...result.data].sort((a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd));
            const top = sorted.slice(0, 10);
            const collectionLines = top.map((nft) => {
                const name = nft.name || nft.collectionAddress.slice(0, 4);
                const value = parseFloat(nft.valueUsd).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                });
                return `- ${name}: ${nft.totalItems} item(s) (≈ ${value})`;
            });
            const summary = `Wallet ${result.ownerAddress.slice(0, 4)}... holds ${result.totalNftCollectionCount} NFT collections worth $${parseFloat(result.totalUsd).toLocaleString(undefined, {
                maximumFractionDigits: 2,
            })}.`;
            return {
                status: "success",
                result: {
                    summary,
                    collections: collectionLines,
                    note: result.data.length > 10 ? "Only showing top 10 NFT collections" : undefined,
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
exports.default = getNftBalancesAction;
//# sourceMappingURL=getNftBalances.js.map