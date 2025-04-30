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
const get_programs_list_1 = require("../../tools/programs/get_programs_list");
/**
 * Action to get a union-list of Solana programs based on labels or popularity.
 */
const getProgramsListAction = {
    name: "GET_VYBE_PROGRAMS_LIST",
    description: "Fetch a list of Solana programs that have IDLs on-chain. Sort by DAU, TXs, or labels.",
    similes: [
        "Show top defi or nft programs",
        "Get Solana programs with most users",
        "List all Solana programs by category",
        "Which dApps have IDLs on-chain?",
        "Find programs for DEFI, NFT, or ORACLE",
    ],
    examples: [
        [
            {
                input: {
                    labels: ["defi", "nft"],
                    limit: 5,
                },
                output: {
                    status: "success",
                    result: {
                        count: 5,
                        programs: [
                            {
                                programId: "24Uqj9JCLx...",
                                name: "Meteora Vault Program",
                                dau: 20508,
                                transactions1d: 297026,
                                instructions1d: 297487,
                                labels: ["DEFI", "AMM"],
                            },
                        ],
                    },
                },
                explanation: "Returns a union of programs with DEFI or NFT labels, limited to 5 results",
            },
        ],
    ],
    schema: zod_1.z.object({
        labels: zod_1.z.array(zod_1.z.string()).optional(),
        limit: zod_1.z.number().min(1).max(100).optional(),
        page: zod_1.z.number().min(0).optional(),
        sortByAsc: zod_1.z.enum(["dau", "name", "transactions1d", "instructions1d"]).optional(),
        sortByDesc: zod_1.z.enum(["dau", "name", "transactions1d", "instructions1d"]).optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_programs_list_1.getProgramsList)(agent, parsedInput);
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
exports.default = getProgramsListAction;
//# sourceMappingURL=getProgramsList.js.map