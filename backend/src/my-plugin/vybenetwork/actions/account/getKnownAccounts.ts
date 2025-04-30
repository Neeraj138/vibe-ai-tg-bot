import { Action } from "solana-agent-kit";
import { z } from "zod";
import { getKnownAccounts } from "../../tools/account/get_known_accounts";
import {
  GetKnownAccountsInput,
  GetKnownAccountsResponse,
} from "../../types/account/known_accounts";

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
const labelAliases: Record<string, string> = {
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
function normalizeLabels(inputLabels: string[] = []): string[] {
  return inputLabels
    .map((label) => label.trim().toLowerCase())
    .map((lower) =>
      labelAliases[lower] ||
      Array.from(allowedLabels).find((real) => real.toLowerCase() === lower)
    )
    .filter(Boolean)
    .slice(0, 1) as string[];
}

/**
 * Action to fetch known accounts from Vybe Network
 */
const getKnownAccountsAction: Action = {
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
  schema: z.object({
    ownerAddress: z.string().optional(),
    name: z.string().optional(),
    labels: z.array(z.string()).optional(),
    entityName: z.string().optional(),
    entityId: z.number().optional(),
    sortByAsc: z.string().optional(),
    sortByDesc: z.string().optional(),
  }),
  handler: async (agent, input) => {
    try {
      const parsedInput = input as GetKnownAccountsInput;
      parsedInput.labels = normalizeLabels(parsedInput.labels);

      const result: GetKnownAccountsResponse = await getKnownAccounts(agent, parsedInput);
      const accounts = result.accounts.slice(0, 10); // ✅ limit to top 10 only

      // Format summary to avoid LLM overload
      const summary = accounts.length
        ? `Top ${accounts.length} known accounts:\n` +
          accounts
            .map(
              (a, i) =>
                `${i + 1}. ${a.name || "Unnamed"} (${a.ownerAddress.slice(0, 8)}...) – ` +
                `${a.labels.join(", ") || "No labels"}`
            )
            .join("\n")
        : "No known accounts found for the given label(s).";

      return {
        status: "success",
        result: {
          summary,
          note: accounts.length === 10 ? "Showing only top 10 results due to model token limits." : undefined,
        },
      };
    } catch (e) {
      return {
        status: "error",
        message: (e as Error).message,
      };
    }
  },
};

export default getKnownAccountsAction;
