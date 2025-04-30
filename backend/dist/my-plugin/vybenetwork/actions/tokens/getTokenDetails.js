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
const get_token_details_1 = require("../../tools/tokens/get_token_details");
/**
 * Action to fetch complete token information like price, supply, 24h volume, and more.
 */
const getTokenDetailsAction = {
    name: "GET_VYBE_TOKEN_DETAILS",
    description: "Fetch details about a token on Solana including price, supply, marketcap, and 24-hour volume.",
    similes: [
        "Show me details about the SEND token",
        "Get marketcap and supply info for a token",
        "Fetch full info of a Solana token",
        "Find the latest price of a token",
        "Check how much volume happened for a token in the last 24 hours",
    ],
    examples: [
        [
            {
                input: {
                    mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
                },
                output: {
                    status: "success",
                    result: {
                        symbol: "SEND",
                        name: "Send",
                        price: 0.01376,
                        marketCap: 13758545.88,
                        tokenAmountVolume24h: 19173318.69,
                        usdValueVolume24h: 265962.27,
                    },
                },
                explanation: "Fetches basic price, marketcap, and volume info for the SEND token",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().min(32),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            const result = yield (0, get_token_details_1.getTokenDetails)(agent, parsedInput);
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
exports.default = getTokenDetailsAction;
//# sourceMappingURL=getTokenDetails.js.map