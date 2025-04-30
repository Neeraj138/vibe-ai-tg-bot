import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTopTokenHoldersInput,
  GetTopTokenHoldersResponse,
} from "../../types/tokens/get_top_token_holders";

/**
 * Fetches the top token holders for a specific token mint address.
 */
export async function getTopTokenHolders(
  agent: SolanaAgentKit,
  input: GetTopTokenHoldersInput
): Promise<GetTopTokenHoldersResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const params = new URLSearchParams();
  if (input.page !== undefined) params.append("page", input.page.toString());
  if (input.limit !== undefined) params.append("limit", input.limit.toString());
  if (input.sortByAsc) params.append("sortByAsc", input.sortByAsc);
  if (input.sortByDesc) params.append("sortByDesc", input.sortByDesc);

  const url = `https://api.vybenetwork.xyz/token/${input.mintAddress}/top-holders?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch top token holders");
    }

    const json = await res.json();
    return json as GetTopTokenHoldersResponse;
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
