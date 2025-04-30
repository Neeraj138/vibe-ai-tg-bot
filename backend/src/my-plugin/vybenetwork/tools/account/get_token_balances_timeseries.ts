import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTokenBalancesTimeSeriesInput,
  GetTokenBalancesTimeSeriesResponse,
} from "../../types/account/token_balances_timeseries";

/**
 * Fetch daily token balances (SOL, staked SOL, SPL tokens) as a time-series from Vybe Network.
 */
export async function getTokenBalancesTimeSeries(
  agent: SolanaAgentKit,
  input: GetTokenBalancesTimeSeriesInput
): Promise<GetTokenBalancesTimeSeriesResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { ownerAddress, days } = input;

  const query = new URLSearchParams();
  if (days) query.append("days", days.toString());

  const url = `https://api.vybenetwork.xyz/account/token-balance-ts/${ownerAddress}?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch token balance time-series");
    }

    return await res.json();
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
