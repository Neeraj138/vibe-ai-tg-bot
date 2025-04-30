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
const get_program_active_users_1 = require("../../tools/programs/get_program_active_users");
/**
 * Action to fetch top active users for a Solana program using Vybe Network.
 */
const getProgramActiveUsersAction = {
    name: "GET_VYBE_PROGRAM_ACTIVE_USERS",
    description: "Fetch active users, transaction counts, and instruction counts for a Solana program.",
    similes: [
        "Who are the most active users of this program?",
        "Get top wallets interacting with a program",
        "Show program user activity",
        "Top program users on Solana",
        "Most transactions on this program"
    ],
    examples: [
        [
            {
                input: {
                    programAddress: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
                },
                output: {
                    status: "success",
                    result: {
                        programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
                        topUsersByTransactions: [
                            {
                                wallet: "abc...",
                                transactions: 25,
                                instructions: 30,
                                programId: "pyt..."
                            }
                        ],
                        topUsersByInstructions: [
                            {
                                wallet: "xyz...",
                                transactions: 24,
                                instructions: 32,
                                programId: "pyt..."
                            }
                        ],
                        note: "Stats shown are based on the first 1000 active users returned by Vybe and may not reflect the full activity of the program."
                    }
                },
                explanation: "Returns top active wallets interacting with this program"
            }
        ]
    ],
    schema: zod_1.z.object({
        programAddress: zod_1.z.string().min(32, "Program address is required"),
        days: zod_1.z.number().optional(),
        limit: zod_1.z.number().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, get_program_active_users_1.getProgramActiveUsers)(agent, input);
            return {
                status: "success",
                result,
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
exports.default = getProgramActiveUsersAction;
//# sourceMappingURL=getProgramActiveUsers.js.map