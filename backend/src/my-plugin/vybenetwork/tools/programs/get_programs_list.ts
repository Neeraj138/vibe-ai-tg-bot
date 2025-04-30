import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetProgramsListInput,
  GetProgramsListResponse,
} from "../../types/programs/get_programs_list";
import { normalizeFuzzyLabel, uniqueValidLabelsOnly } from "../../utils/labelHelpers";

/**
 * Get a list of programs with optional filters and label union logic.
 */
export async function getProgramsList(
  agent: SolanaAgentKit,
  input: GetProgramsListInput
): Promise<GetProgramsListResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { labels = [], ...queryParams } = input;
  const normalizedLabels = uniqueValidLabelsOnly(labels);
  const query = new URLSearchParams();

  if (normalizedLabels.length > 0) {
    query.append("labels", normalizedLabels.join(","));
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/programs?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch programs list");
    }

    const json = await res.json();
    return {
      count: json.data.length,
      programs: json.data,
    };
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
