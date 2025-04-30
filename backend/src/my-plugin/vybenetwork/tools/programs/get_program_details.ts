import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetProgramDetailsInput,
  GetProgramDetailsResponse,
} from "../../types/programs/program_details";

/**
 * Fetch program details from Vybe Network
 */
export async function getProgramDetails(
  agent: SolanaAgentKit,
  input: GetProgramDetailsInput
): Promise<GetProgramDetailsResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const url = `https://api.vybenetwork.xyz/program/${input.programAddress}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch program details");
    }

    const data = await res.json();

    return {
      programId: data.programId,
      name: data.name,
      labels: data.labels,
      transactions1d: data.transactions1d,
      dau: data.dau,
      entityName: data.entityName,
      programDescription: data.programDescription,
    };
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
