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
exports.getTokenHoldersTimeSeries = getTokenHoldersTimeSeries;
/**
 * Fetches time series of token holders count for a specific token.
 */
function getTokenHoldersTimeSeries(agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (_a = agent.config) === null || _a === void 0 ? void 0 : _a.VYBE_API_KEY;
        if (!apiKey)
            throw new Error("Missing VYBE_API_KEY in agent config");
        const params = new URLSearchParams();
        if (input.startTime)
            params.append("startTime", input.startTime.toString());
        if (input.endTime)
            params.append("endTime", input.endTime.toString());
        if (input.interval)
            params.append("interval", input.interval);
        if (input.limit)
            params.append("limit", input.limit.toString());
        if (input.page)
            params.append("page", input.page.toString());
        const url = `https://api.vybenetwork.xyz/token/${input.mintAddress}/holders-ts?${params.toString()}`;
        try {
            const res = yield fetch(url, {
                headers: {
                    "X-API-KEY": apiKey,
                    accept: "application/json",
                },
            });
            if (!res.ok) {
                const error = yield res.json();
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch token holders time series");
            }
            const json = yield res.json();
            return json;
        }
        catch (err) {
            throw new Error(`Vybe API Error: ${err.message}`);
        }
    });
}
//# sourceMappingURL=get_token_holders_time_series.js.map