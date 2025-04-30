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
const get_program_tvl_ts_1 = require("../../tools/programs/get_program_tvl_ts");
/**
 * Action to get historical TVL for a Solana program.
 */
const getProgramTvlTSAction = {
    name: "GET_VYBE_PROGRAM_TVL_TS",
    description: "Fetch historical TVL (Total Value Locked) time series for a Solana program.",
    similes: [
        "Show TVL chart for this program",
        "Get historical TVL for a Solana program",
        "Track TVL performance of this contract",
        "Fetch TVL data over time for a dApp",
    ],
    examples: [
        [
            {
                input: {
                    programAddress: "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
                    resolution: "1d",
                },
                output: {
                    status: "success",
                    result: {
                        programId: "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
                        trend: [
                            {
                                tvl: "158283666.10072076150776730879",
                                time: "2025-03-21T00:00:00Z",
                            },
                        ],
                    },
                },
                explanation: "TVL history for the given program over daily resolution",
            },
        ],
    ],
    schema: zod_1.z.object({
        programAddress: zod_1.z.string().min(32, "Program address required"),
        resolution: zod_1.z
            .string()
            .regex(/^(1[dhw]|[2-9][dhw]?|[1-9][0-9]+s)?$/, "Invalid resolution. Use '1d', '1h', '1w' etc."),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_program_tvl_ts_1.getProgramTvlTimeSeries)(agent, parsedInput);
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
exports.default = getProgramTvlTSAction;
//# sourceMappingURL=getProgramTvlTS.js.map