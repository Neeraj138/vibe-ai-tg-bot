"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFuzzyLabel = normalizeFuzzyLabel;
exports.uniqueValidLabelsOnly = uniqueValidLabelsOnly;
const knownLabels = new Set([
    "GAMING", "NFT", "INFRA", "ORACLE", "DEFI", "MARKETPLACE", "DePIN", "DEX",
    "BORROW/LEND", "PERPS", "OPTIONS", "BOT", "DeFi", "AMM", "FUNDING",
    "STAKING", "", "CLOB", "SYSTEM", "AGGREGATOR", "SOCIAL", "WALLET",
    "PAYMENTS", "CEX", "SNS", "BRIDGE", "DAO", "MULTISIG", "Launchpad",
    "PRIVACY", "MEV"
]);
/**
 * Normalize a fuzzy label string to a known label, if available.
 * E.g. "defi" → "DEFI", "nft" → "NFT"
 */
function normalizeFuzzyLabel(label) {
    const upper = label.toUpperCase();
    for (const known of knownLabels) {
        if (known.toUpperCase() === upper ||
            known.toLowerCase() === label.toLowerCase()) {
            return known;
        }
    }
    return undefined; // not recognized
}
/**
 * Filters an array of input labels to only unique, valid, normalized labels.
 */
function uniqueValidLabelsOnly(labels) {
    const seen = new Set();
    for (const label of labels) {
        const normalized = normalizeFuzzyLabel(label);
        if (normalized) {
            seen.add(normalized);
        }
    }
    return [...seen];
}
//# sourceMappingURL=labelHelpers.js.map