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
const get_known_accounts_1 = require("../../tools/account/get_known_accounts");
/**
 * Set of valid Vybe label values (case-sensitive)
 */
const allowedLabels = new Set([
    "DeFi", "CLOB", "Pool", "dApp", "NFT", "Marketplace", "KOL", "CLMM", "CEX",
    "Treasury", "VC", "DEFI", "SYSTEM", "Bridge", "MM", "DAO", "Hacker",
    "BORROW/LEND", "PERPS", "AGGREGATOR", "DEX", "Whale"
]);
/**
 * Maps fuzzy or user-friendly labels to proper Vybe labels
 */
const labelAliases = {
    amm: "Pool",
    dex: "DEX",
    defi: "DeFi",
    defy: "DeFi",
    clob: "CLOB",
    dao: "DAO",
    lend: "BORROW/LEND",
    borrow: "BORROW/LEND",
    "borrow/lend": "BORROW/LEND",
    vc: "VC",
    "vc fund": "VC",
    kol: "KOL",
    influencer: "KOL",
};
/**
 * Normalize user labels → API-friendly labels (only first one for safe API call)
 */
function normalizeLabels(inputLabels = []) {
    return inputLabels
        .map((label) => label.trim().toLowerCase())
        .map((lower) => labelAliases[lower] ||
        Array.from(allowedLabels).find((real) => real.toLowerCase() === lower))
        .filter(Boolean)
        .slice(0, 1);
}
/**
 * Action to fetch known accounts from Vybe Network
 */
const getKnownAccountsAction = {
    name: "GET_KNOWN_VYBE_ACCOUNTS",
    description: "Fetch categorized Solana accounts (e.g. DeFi pools, influencers) using Vybe Network.",
    similes: [
        "Get known Solana accounts",
        "Fetch influencer or treasury wallets",
        "Show categorized Solana accounts",
    ],
    examples: [
        [
            {
                input: {
                    labels: ["amm"],
                },
                output: {
                    status: "success",
                    result: {
                        summary: "Top 10 known Pool accounts: Raydium CWAR-USDC, Orca SOL-USDC, ...",
                    },
                },
                explanation: "Fetch AMM-related (Pool) accounts from Vybe and return readable summary",
            },
        ],
    ],
    schema: zod_1.z.object({
        ownerAddress: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        labels: zod_1.z.array(zod_1.z.string()).optional(),
        entityName: zod_1.z.string().optional(),
        entityId: zod_1.z.number().optional(),
        sortByAsc: zod_1.z.string().optional(),
        sortByDesc: zod_1.z.string().optional(),
    }),
    handler: (agent, input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsedInput = input;
            parsedInput.labels = normalizeLabels(parsedInput.labels);
            const result = yield (0, get_known_accounts_1.getKnownAccounts)(agent, parsedInput);
            const accounts = result.accounts.slice(0, 10); // ✅ limit to top 10 only
            // Format summary to avoid LLM overload
            const summary = accounts.length
                ? `Top ${accounts.length} known accounts:\n` +
                    accounts
                        .map((a, i) => `${i + 1}. ${a.name || "Unnamed"} (${a.ownerAddress.slice(0, 8)}...) – ` +
                        `${a.labels.join(", ") || "No labels"}`)
                        .join("\n")
                : "No known accounts found for the given label(s).";
            return {
                status: "success",
                result: {
                    summary,
                    note: accounts.length === 10 ? "Showing only top 10 results due to model token limits." : undefined,
                },
            };
        }
        catch (e) {
            return {
                status: "error",
                message: e.message,
            };
        }
    }),
};
exports.default = getKnownAccountsAction;
//# sourceMappingURL=getKnownAccounts.js.map