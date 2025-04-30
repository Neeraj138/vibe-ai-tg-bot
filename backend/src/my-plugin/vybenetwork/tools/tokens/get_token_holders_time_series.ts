import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTokenHoldersTimeSeriesInput,
  GetTokenHoldersTimeSeriesResponse,
} from "../../types/tokens/get_token_holders_time_series";

/**
 * Fetches time series of token holders count for a specific token.
 */
export async function getTokenHoldersTimeSeries(
  agent: SolanaAgentKit,
  input: GetTokenHoldersTimeSeriesInput
): Promise<GetTokenHoldersTimeSeriesResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const params = new URLSearchParams();
  if (input.startTime) params.append("startTime", input.startTime.toString());
  if (input.endTime) params.append("endTime", input.endTime.toString());
  if (input.interval) params.append("interval", input.interval);
  if (input.limit) params.append("limit", input.limit.toString());
  if (input.page) params.append("page", input.page.toString());

  const url = `https://api.vybenetwork.xyz/token/${input.mintAddress}/holders-ts?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch token holders time series");
    }

    const json = await res.json();
    return json as GetTokenHoldersTimeSeriesResponse;
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
