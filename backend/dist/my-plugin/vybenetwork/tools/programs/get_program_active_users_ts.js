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
exports.getProgramActiveUsersTimeSeries = getProgramActiveUsersTimeSeries;
/**
 * Fetch daily/weekly active user time series data for a Solana program.
 */
function getProgramActiveUsersTimeSeries(agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (_a = agent.config) === null || _a === void 0 ? void 0 : _a.VYBE_API_KEY;
        if (!apiKey)
            throw new Error("Missing VYBE_API_KEY in agent config");
        const { programAddress, range } = input;
        const url = `https://api.vybenetwork.xyz/program/${programAddress}/active-users-ts?range=${range}`;
        try {
            const res = yield fetch(url, {
                headers: {
                    "X-API-KEY": apiKey,
                    accept: "application/json",
                },
            });
            if (!res.ok) {
                const error = yield res.json();
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch active user trend");
            }
            const json = yield res.json();
            return {
                programId: programAddress,
                trend: json.data,
            };
        }
        catch (err) {
            throw new Error(`Vybe API Error: ${err.message}`);
        }
    });
}
//# sourceMappingURL=get_program_active_users_ts.js.map