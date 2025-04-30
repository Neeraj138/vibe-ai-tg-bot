import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTokenTransfersInput,
  GetTokenTransfersResponse,
} from "../../types/tokens/get_token_transfers";

/**
 * Fetch token transfer transactions with flexible filters.
 */
export async function getTokenTransfers(
  agent: SolanaAgentKit,
  input: GetTokenTransfersInput
): Promise<GetTokenTransfersResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const query = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/token/transfers?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch token transfers");
    }

    const json = await res.json();
    return {
      count: json.transfers.length,
      transfers: json.transfers,
    };
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
