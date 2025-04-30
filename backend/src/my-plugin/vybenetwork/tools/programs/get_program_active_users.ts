import { SolanaAgentKit } from "solana-agent-kit";
import {
  ActiveUser,
  GetProgramActiveUsersResponse,
} from "../../types/programs/program_active_users";

/**
 * Fetch active users of a Solana program from Vybe Network API.
 */
export async function getProgramActiveUsers(
  agent: SolanaAgentKit,
  input: {
    programAddress: string;
    days?: number;
    limit?: number;
    sortByAsc?: string;
    sortByDesc?: string;
  }
): Promise<GetProgramActiveUsersResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { programAddress, ...queryParams } = input;
  const query = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  });

  const url = `https://api.vybenetwork.xyz/program/${programAddress}/active-users?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch program active users");
    }

    const result = await res.json();

    const users: ActiveUser[] = result.data;
    const sortedByTx = [...users].sort((a, b) => b.transactions - a.transactions).slice(0, 10);
    const sortedByIx = [...users].sort((a, b) => b.instructions - a.instructions).slice(0, 10);

    return {
      programId: programAddress,
      topUsersByTransactions: sortedByTx,
      topUsersByInstructions: sortedByIx,
      note: "Stats shown are based on the first 1000 active users returned by Vybe and may not reflect the full activity of the program.",
    };
  } catch (err) {
    throw new Error(`Vybe API Error: ${(err as Error).message}`);
  }
}
