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
const get_program_active_users_ts_1 = require("../../tools/programs/get_program_active_users_ts");
/**
 * Action to fetch active user trend (DAU time series) for a Solana program.
 */
const getProgramActiveUsersTSAction = {
    name: "GET_VYBE_PROGRAM_ACTIVE_USERS_TS",
    description: "Get active user time series (DAU) for a given Solana program.",
    similes: [
        "Show DAU trend of a program",
        "Get active users over time",
        "Daily active users for a Solana program",
        "Solana program usage chart",
        "DAU stats for a Solana contract",
    ],
    examples: [
        [
            {
                input: {
                    programAddress: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
                    range: "7d",
                },
                output: {
                    status: "success",
                    result: {
                        programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
                        trend: [
                            {
                                dau: 589,
                                blockTime: 1744588800,
                                programId: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
                            },
                        ],
                    },
                },
                explanation: "Returns DAU stats over the past 7 days for the given program",
            },
        ],
    ],
    schema: zod_1.z.object({
        programAddress: zod_1.z.string().min(32, "Valid program address required"),
        range: zod_1.z
            .string()
            .regex(/^(?:[1-9]|[12][0-9]|30)[dh]$/, "Range must be like '7d' or '12h'"),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_program_active_users_ts_1.getProgramActiveUsersTimeSeries)(agent, parsedInput);
            return { status: "success", result };
        }
        catch (e) {
            return { status: "error", message: e.message };
        }
    }),
};
exports.default = getProgramActiveUsersTSAction;
//# sourceMappingURL=getProgramActiveUsersTS.js.map