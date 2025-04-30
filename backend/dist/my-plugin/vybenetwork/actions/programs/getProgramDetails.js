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
const get_program_details_1 = require("../../tools/programs/get_program_details");
/**
 * Action for fetching program metadata using Vybe Network
 */
const getProgramDetailsAction = {
    name: "GET_PROGRAM_DETAILS_VYBE",
    description: "Get 1-day transactions, DAU, name, and description of a Solana program",
    similes: [
        "Get program metadata",
        "Fetch program info from Vybe",
        "Tell me about a program",
        "Give me usage stats of this Solana program",
        "What is this program used for?",
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
                        name: "Pyth Staking",
                        labels: ["INFRA", "ORACLE", "DEFI"],
                        transactions1d: 889,
                        dau: 372,
                        entityName: "Pyth Network",
                        programDescription: "A staking protocol for participating in the Pyth Network, which provides high-fidelity financial data for smart contracts.",
                    },
                },
                explanation: "Shows daily usage and info for Pyth program",
            },
        ],
    ],
    schema: zod_1.z.object({
        programAddress: zod_1.z.string().min(32),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, get_program_details_1.getProgramDetails)(agent, input);
            return {
                status: "success",
                result: {
                    programId: result.programId,
                    name: result.name,
                    labels: result.labels,
                    transactions1d: result.transactions1d,
                    dau: result.dau,
                    entityName: result.entityName,
                    programDescription: result.programDescription,
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
exports.default = getProgramDetailsAction;
//# sourceMappingURL=getProgramDetails.js.map