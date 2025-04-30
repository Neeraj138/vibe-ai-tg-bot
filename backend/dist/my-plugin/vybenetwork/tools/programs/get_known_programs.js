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
exports.getKnownPrograms = getKnownPrograms;
const normalizeLabels_1 = require("../../utils/normalizeLabels");
/**
 * Fetches categorized known Solana programs from Vybe.
 */
function getKnownPrograms(agent, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (_a = agent.config) === null || _a === void 0 ? void 0 : _a.VYBE_API_KEY;
        if (!apiKey)
            throw new Error("Missing VYBE_API_KEY in agent config");
        const query = new URLSearchParams();
        Object.entries(input).forEach(([key, value]) => {
            if (key === "labels" && Array.isArray(value)) {
                query.append("labels", (0, normalizeLabels_1.normalizeLabels)(value).join(","));
            }
            else if (value !== undefined && value !== null) {
                query.append(key, value.toString());
            }
        });
        const url = `https://api.vybenetwork.xyz/program/known-program-accounts?${query.toString()}`;
        try {
            const res = yield fetch(url, {
                headers: {
                    "X-API-KEY": apiKey,
                    accept: "application/json",
                },
            });
            if (!res.ok) {
                const error = yield res.json();
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch known programs");
            }
            return yield res.json();
        }
        catch (err) {
            throw new Error(`Vybe API Error: ${err.message}`);
        }
    });
}
//# sourceMappingURL=get_known_programs.js.map