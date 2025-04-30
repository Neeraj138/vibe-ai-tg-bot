import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetNftBalancesInput,
  GetNftBalancesResponse,
} from "../../types/account/nft_balances";

/**
 * Fetch NFT balances of a Solana wallet using Vybe Network API.
 */
export async function getNftBalances(
  agent: SolanaAgentKit,
  input: GetNftBalancesInput
): Promise<GetNftBalancesResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { ownerAddress, ...params } = input;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/account/nft-balance/${ownerAddress}?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch NFT balances");
    }

    return await res.json();
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
