import { SolanaAgentKit } from "solana-agent-kit";
import {
  GetProgramTransactionsTSInput,
  GetProgramTransactionsTSResponse,
} from "../../types/programs/get_program_transactions_ts";

/**
 * Fetch time series data for transaction counts of a Solana program.
 */
export async function getProgramTransactionsTimeSeries(
  agent: SolanaAgentKit,
  input: GetProgramTransactionsTSInput
): Promise<GetProgramTransactionsTSResponse> {
  const apiKey = agent.config?.VYBE_API_KEY;
  if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

  const { programAddress, range } = input;
  const url = `https://api.vybenetwork.xyz/program/${programAddress}/transactions-count-ts?range=${range}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to fetch transaction count trend");
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
