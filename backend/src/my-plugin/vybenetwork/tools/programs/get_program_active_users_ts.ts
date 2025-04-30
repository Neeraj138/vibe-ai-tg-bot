import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetProgramActiveUsersTSInput,
  GetProgramActiveUsersTSResponse,
} from "../../types/programs/get_program_active_users_ts";

/**
 * Fetch daily/weekly active user time series data for a Solana program.
 */
export async function getProgramActiveUsersTimeSeries(
  agent: SolanaAgentKit,
  input: GetProgramActiveUsersTSInput
): Promise<GetProgramActiveUsersTSResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { programAddress, range } = input;
  const url = `https://api.vybenetwork.xyz/program/${programAddress}/active-users-ts?range=${range}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch active user trend");
    }

    const json = await res.json();
    return {
      programId: programAddress,
      trend: json.data,
    };
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
