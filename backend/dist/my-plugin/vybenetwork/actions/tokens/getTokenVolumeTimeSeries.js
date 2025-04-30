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
const get_token_volume_time_series_1 = require("../../tools/tokens/get_token_volume_time_series");
/**
 * Action to retrieve token transfer volume time series.
 */
const getTokenVolumeTimeSeriesAction = {
    name: "GET_VYBE_TOKEN_VOLUME_TIME_SERIES",
    description: "Retrieve token transfer volume in USD and token amount over a selected time period.",
    similes: [
        "Show SEND token transfer volume over the past week",
        "Get daily volume for a token",
        "Show how much a token was transferred recently",
        "Token transfer trends in USD",
    ],
    examples: [
        [
            {
                input: {
                    mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
                    startTime: 1745782470,
                    endTime: 1745868870,
                    limit: 10,
                },
                output: {
                    status: "success",
                    result: {
                        data: [
                            {
                                timeBucketStart: 1745712000,
                                volume: "25381.98417454587443275396",
                                amount: "1824978.969166",
                            },
                            {
                                timeBucketStart: 1745798400,
                                volume: "508790.52322773806620207602",
                                amount: "36698335.827200",
                            },
                        ],
                    },
                },
                explanation: "Fetches token transfer volume (both amount and USD) for the SEND token within the specified time range.",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().min(32),
        startTime: zod_1.z.number().optional(),
        endTime: zod_1.z.number().optional(),
        interval: zod_1.z.string().optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_volume_time_series_1.getTokenVolumeTimeSeries)(agent, parsedInput);
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
exports.default = getTokenVolumeTimeSeriesAction;
//# sourceMappingURL=getTokenVolumeTimeSeries.js.map