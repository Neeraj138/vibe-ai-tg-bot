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
const get_top_token_holders_1 = require("../../tools/tokens/get_top_token_holders");
/**
 * Action to retrieve the top 1,000 holders of a token.
 */
const getTopTokenHoldersAction = {
    name: "GET_VYBE_TOP_TOKEN_HOLDERS",
    description: "Retrieve the top holders for a specific Solana token.",
    similes: [
        "Show me the top holders of the SEND token",
        "Who are the biggest holders of a token?",
        "Get the richest wallets holding a token",
        "Top 10 wallets holding SEND",
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
                                rank: 1,
                                ownerAddress: "BQbS88PTBCnkDtYbY99YkfW887uEAbCcbGtYajPgjRpw",
                                balance: "263857435.139089",
                                valueUsd: "3619687.737386",
                                percentageOfSupplyHeld: 26.396075,
                            },
                            {
                                rank: 2,
                                ownerAddress: "EnSRZiz6p5Jituc3uNCQMfMFDGqDtUwuycWBVj1PGNjG",
                                balance: "146136896.687531",
                                valueUsd: "2004756.593805",
                                percentageOfSupplyHeld: 14.619411,
                            },
                            {
                                rank: 3,
                                ownerAddress: "H8wYJTYD4ZwJjBvezf441DwL133hXtWn1hcgEW2BFR5z",
                                balance: "53879219.867433",
                                valueUsd: "739133.810466",
                                percentageOfSupplyHeld: 5.390032,
                            },
                            {
                                rank: 4,
                                ownerAddress: "u1bZDXRnLUvy6iwi6uuyvwpqgPUNf2XMAzRgRbVmUbx",
                                balance: "41074958.405216",
                                valueUsd: "563480.514296",
                                percentageOfSupplyHeld: 4.109104,
                            },
                            {
                                rank: 5,
                                ownerAddress: "93aKLoUhk5rW2BFxShF8siXJCmedv9Z76EqtktbmhCWX",
                                balance: "41074948.576360",
                                valueUsd: "563480.379460",
                                percentageOfSupplyHeld: 4.109103,
                            },
                        ],
                    },
                },
                explanation: "Fetches top 5 holders for the SEND token.",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().min(32),
        page: zod_1.z.number().optional(),
        limit: zod_1.z.number().optional(),
        sortByAsc: zod_1.z.enum(["rank", "ownerName", "ownerAddress", "valueUsd", "balance", "percentageOfSupplyHeld"]).optional(),
        sortByDesc: zod_1.z.enum(["rank", "ownerName", "ownerAddress", "valueUsd", "balance", "percentageOfSupplyHeld"]).optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_top_token_holders_1.getTopTokenHolders)(agent, parsedInput);
            return { status: "success", result };
        }
        catch (e) {
            return {
                status: "error",
                message: e.message,
            };
        }
    }),
};
exports.default = getTopTokenHoldersAction;
//# sourceMappingURL=getTopTokenHolders.js.map