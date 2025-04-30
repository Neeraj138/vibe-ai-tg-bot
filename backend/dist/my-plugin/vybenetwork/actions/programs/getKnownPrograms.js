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
const get_known_programs_1 = require("../../tools/programs/get_known_programs");
const getKnownProgramsAction = {
    name: "GET_KNOWN_VYBE_PROGRAMS",
    description: "Fetch categorized Solana program accounts from Vybe Network.",
    similes: [
        "Show me popular programs on Solana",
        "What are some DeFi programs?",
        "List NFT program IDs",
        "Fetch known Solana protocols",
        "Give me Solana infra programs"
    ],
    examples: [
        [
            {
                input: {
                    labels: ["NFT", "GAMING"],
                },
                output: {
                    status: "success",
                    programs: [
                        {
                            programId: "xxxx...",
                            name: "Star Atlas",
                            labels: ["GAMING"]
                        }
                    ],
                },
                explanation: "Fetches NFT and GAMING program accounts on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        programId: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        labels: zod_1.z.array(zod_1.z.string()).optional(),
        entityName: zod_1.z.string().optional(),
        entityId: zod_1.z.number().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, get_known_programs_1.getKnownPrograms)(agent, input);
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
exports.default = getKnownProgramsAction;
//# sourceMappingURL=getKnownPrograms.js.map