import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetKnownAccountsInput,
  GetKnownAccountsResponse,
} from "../../types/account/known_accounts";

/**
 * Fetches known Solana accounts from Vybe Network API.
 */
export async function getKnownAccounts(
  agent: SolanaAgentKit,
  input: GetKnownAccountsInput
): Promise<GetKnownAccountsResponse> {
  const apiKey = (agent.config as Record<string, string>).VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const query = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (key === "labels" && Array.isArray(value)) {
      query.append("labels", value.join(",")); // ✅ comma-separated, not repeated
    } else if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/account/known-accounts?${query.toString()}`;
  console.log("🔗 Vybe Request URL:", url);

  try {
    console.log("calling api", apiKey)

    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });


    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch known accounts");
    }

    return await res.json();
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
