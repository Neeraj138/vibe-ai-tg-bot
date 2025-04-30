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
const get_program_transactions_ts_1 = require("../../tools/programs/get_program_transactions_ts");
/**
 * Action to get transaction count time-series for a Solana program.
 */
const getProgramTransactionsTSAction = {
    name: "GET_VYBE_PROGRAM_TRANSACTIONS_TS",
    description: "Fetch historical transaction count trend for a Solana program.",
    similes: [
        "Show tx trend for a Solana program",
        "Transaction volume over time for this program",
        "Plot tx activity for program",
        "Get transaction stats for a smart contract",
    ],
    examples: [
        [
            {
                input: {
                    programAddress: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
                    range: "7d",
                },
                output: {
                    status: "success",
                    result: {
                        programId: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
                        trend: [
                            {
                                transactionsCount: 1154343,
                                blockTime: 1744588800,
                                programId: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
                            },
                        ],
                    },
                },
                explanation: "Returns transaction volume trend for the given program over 7 days",
            },
        ],
    ],
    schema: zod_1.z.object({
        programAddress: zod_1.z.string().min(32, "Program address required"),
        range: zod_1.z
            .string()
            .regex(/^(?:[1-9]|[12][0-9]|30)[dh]$/, "Range must be like '7d' or '12h'"),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_program_transactions_ts_1.getProgramTransactionsTimeSeries)(agent, parsedInput);
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
exports.default = getProgramTransactionsTSAction;
//# sourceMappingURL=getProgramTransactionsTS.js.map