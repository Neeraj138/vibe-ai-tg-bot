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
const get_token_holders_time_series_1 = require("../../tools/tokens/get_token_holders_time_series");
/**
 * Action to fetch the number of token holders over a given period.
 */
const getTokenHoldersTimeSeriesAction = {
    name: "GET_VYBE_TOKEN_HOLDERS_TIME_SERIES",
    description: "Retrieve the daily time series of token holders for a specific token on Solana.",
    similes: [
        "Show me how many people hold the SEND token over time",
        "Get the daily holders count for a token",
        "Fetch time series data of token holders",
        "How is the number of holders trending for SEND?",
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
                                holdersTimestamp: 1744664400,
                                nHolders: 15671,
                            },
                            {
                                holdersTimestamp: 1744675200,
                                nHolders: 15082,
                            },
                        ],
                    },
                },
                explanation: "Fetches the latest 5 daily holder counts for the SEND token",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().min(32),
        startTime: zod_1.z.number().optional(),
        endTime: zod_1.z.number().optional(),
        interval: zod_1.z.enum(["day"]).optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_holders_time_series_1.getTokenHoldersTimeSeries)(agent, parsedInput);
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
exports.default = getTokenHoldersTimeSeriesAction;
//# sourceMappingURL=getTokenHoldersTimeSeries.js.map