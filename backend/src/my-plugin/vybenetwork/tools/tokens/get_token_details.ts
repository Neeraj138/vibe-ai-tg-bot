import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTokenDetailsInput,
  GetTokenDetailsResponse,
} from "../../types/tokens/get_token_details";

/**
 * Fetches details about a specific token including price, supply, and marketcap.
 */
export async function getTokenDetails(
  agent: SolanaAgentKit,
  input: GetTokenDetailsInput
): Promise<GetTokenDetailsResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const url = `https://api.vybenetwork.xyz/token/${input.mintAddress}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch token details");
    }

    const json = await res.json();
    return json as GetTokenDetailsResponse;
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
