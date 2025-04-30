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
const get_token_transfers_1 = require("../../tools/tokens/get_token_transfers");
/**
 * Action to fetch token transfers on Solana with filters like mint, sender, receiver, time, amount.
 */
const getTokenTransfersAction = {
    name: "GET_VYBE_TOKEN_TRANSFERS",
    description: "Fetch token transfers with filtering options like mint, sender, receiver, time, and amount.",
    similes: [
        "Show recent SEND token transfers",
        "Get token movements between two addresses",
        "List all transfers of a mint in last 7 days",
        "Find top value token transfers",
        "Fetch transfers with high USD value",
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
                        transfers: [
                            {
                                signature: "4JAT1d73tZ9mWu...",
                                senderAddress: "CV6LvzL...",
                                receiverAddress: "8L26HZx...",
                                calculatedAmount: "150.0",
                                valueUsd: "2.18",
                                blockTime: 1745840875,
                            },
                        ],
                    },
                },
                explanation: "Fetches top 5 SEND token transfer transactions",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().optional(),
        signature: zod_1.z.string().optional(),
        callingProgram: zod_1.z.string().optional(),
        senderTokenAccount: zod_1.z.string().optional(),
        senderAddress: zod_1.z.string().optional(),
        receiverTokenAccount: zod_1.z.string().optional(),
        receiverAddress: zod_1.z.string().optional(),
        feePayer: zod_1.z.string().optional(),
        minAmount: zod_1.z.number().optional(),
        maxAmount: zod_1.z.number().optional(),
        timeStart: zod_1.z.number().optional(),
        timeEnd: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
        limit: zod_1.z.number().optional(),
        sortByAsc: zod_1.z.enum(["amount", "slot", "blockTime"]).optional(),
        sortByDesc: zod_1.z.enum(["amount", "slot", "blockTime"]).optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_transfers_1.getTokenTransfers)(agent, parsedInput);
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
exports.default = getTokenTransfersAction;
//# sourceMappingURL=getTokenTransfers.js.map