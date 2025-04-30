import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetKnownProgramsInput,
  GetKnownProgramsResponse,
} from "../../types/programs/known_programs";
import { normalizeLabels } from "../../utils/normalizeLabels";

/**
 * Fetches categorized known Solana programs from Vybe.
 */
export async function getKnownPrograms(
  agent: SolanaAgentKit,
  input: GetKnownProgramsInput
): Promise<GetKnownProgramsResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const query = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (key === "labels" && Array.isArray(value)) {
      query.append("labels", normalizeLabels(value).join(","));
    } else if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/program/known-program-accounts?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch known programs");
    }

    return await res.json();
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
