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
  export function normalizeFuzzyLabel(label: string): string | undefined {
    const upper = label.toUpperCase();
  
    for (const known of knownLabels) {
      if (
        known.toUpperCase() === upper ||
        known.toLowerCase() === label.toLowerCase()
      ) {
        return known;
      }
    }
  
    return undefined; // not recognized
  }
  
  /**
   * Filters an array of input labels to only unique, valid, normalized labels.
   */
  export function uniqueValidLabelsOnly(labels: string[]): string[] {
    const seen = new Set<string>();
  
    for (const label of labels) {
      const normalized = normalizeFuzzyLabel(label);
      if (normalized) {
        seen.add(normalized);
      }
    }
  
    return [...seen];
  }
  