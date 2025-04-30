"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLabels = normalizeLabels;
const knownLabels = new Set([
    "GAMING", "NFT", "INFRA", "ORACLE", "DEFI", "MARKETPLACE", "DePIN", "DEX",
    "BORROW/LEND", "PERPS", "OPTIONS", "BOT", "DeFi", "AMM", "FUNDING",
    "STAKING", "", "CLOB", "SYSTEM", "AGGREGATOR", "SOCIAL", "WALLET",
    "PAYMENTS", "CEX", "SNS", "BRIDGE", "DAO", "MULTISIG", "Launchpad",
    "PRIVACY", "MEV"
]);
/**
 * Maps fuzzy or lowercase inputs to the nearest known labels.
 */
function normalizeLabels(inputLabels) {
    const normalized = new Set();
    for (const label of inputLabels) {
        const upper = label.toUpperCase();
        for (const known of knownLabels) {
            if (known.toUpperCase() === upper || known.toLowerCase() === label.toLowerCase()) {
                normalized.add(known);
                break;
            }
        }
    }
    return [...normalized];
}
//# sourceMappingURL=normalizeLabels.js.map