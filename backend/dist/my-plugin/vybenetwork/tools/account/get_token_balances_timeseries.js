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
exports.getTokenBalancesTimeSeries = getTokenBalancesTimeSeries;
/**
 * Fetch daily token balances (SOL, staked SOL, SPL tokens) as a time-series from Vybe Network.
 */
function getTokenBalancesTimeSeries(agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (_a = agent.config) === null || _a === void 0 ? void 0 : _a.VYBE_API_KEY;
        if (!apiKey)
            throw new Error("Missing VYBE_API_KEY in agent config");
        const { ownerAddress, days } = input;
        const query = new URLSearchParams();
        if (days)
            query.append("days", days.toString());
        const url = `https://api.vybenetwork.xyz/account/token-balance-ts/${ownerAddress}?${query.toString()}`;
        try {
            const res = yield fetch(url, {
                headers: {
                    "X-API-KEY": apiKey,
                    accept: "application/json",
                },
            });
            if (!res.ok) {
                const error = yield res.json();
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch token balance time-series");
            }
            return yield res.json();
        }
        catch (err) {
            throw new Error(`Vybe API Error: ${err.message}`);
        }
    });
}
//# sourceMappingURL=get_token_balances_timeseries.js.map