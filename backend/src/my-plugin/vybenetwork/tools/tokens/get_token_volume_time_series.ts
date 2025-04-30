import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetTokenVolumeTimeSeriesInput,
  GetTokenVolumeTimeSeriesResponse,
} from "../../types/tokens/get_token_volume_time_series";

/**
 * Fetches the token transfer volume (amount and USD) over a selected time period.
 */
export async function getTokenVolumeTimeSeries(
  agent: SolanaAgentKit,
  input: GetTokenVolumeTimeSeriesInput
): Promise<GetTokenVolumeTimeSeriesResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const params = new URLSearchParams();
  if (input.startTime !== undefined) params.append("startTime", input.startTime.toString());
  if (input.endTime !== undefined) params.append("endTime", input.endTime.toString());
  if (input.interval) params.append("interval", input.interval);
  if (input.limit !== undefined) params.append("limit", input.limit.toString());
  if (input.page !== undefined) params.append("page", input.page.toString());

  const url = `https://api.vybenetwork.xyz/token/${input.mintAddress}/transfer-volume?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch token volume time series");
    }

    const json = await res.json();
    return json as GetTokenVolumeTimeSeriesResponse;
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
