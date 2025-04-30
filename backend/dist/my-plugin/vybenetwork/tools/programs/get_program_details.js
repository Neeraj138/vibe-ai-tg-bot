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
exports.getProgramDetails = getProgramDetails;
/**
 * Fetch program details from Vybe Network
 */
function getProgramDetails(agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (_a = agent.config) === null || _a === void 0 ? void 0 : _a.VYBE_API_KEY;
        if (!apiKey)
            throw new Error("Missing VYBE_API_KEY in agent config");
        const url = `https://api.vybenetwork.xyz/program/${input.programAddress}`;
        try {
            const res = yield fetch(url, {
                headers: {
                    "X-API-KEY": apiKey,
                    accept: "application/json",
                },
            });
            if (!res.ok) {
                const error = yield res.json();
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch program details");
            }
            const data = yield res.json();
            return {
                programId: data.programId,
                name: data.name,
                labels: data.labels,
                transactions1d: data.transactions1d,
                dau: data.dau,
                entityName: data.entityName,
                programDescription: data.programDescription,
            };
        }
        catch (err) {
            throw new Error(`Vybe API Error: ${err.message}`);
        }
    });
}
//# sourceMappingURL=get_program_details.js.map