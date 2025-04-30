import { SolanaAgentKit } from "solana-agent-kit";
import {
    GetProgramTvlTSInput,
    GetProgramTvlTSResponse,
} from "../../types/programs/get_program_tvl_ts";

/**
 * Fetch TVL time series for a Solana program from Vybe Network.
 */
export async function getProgramTvlTimeSeries(
    agent: SolanaAgentKit,
    input: GetProgramTvlTSInput
): Promise<GetProgramTvlTSResponse> {
    const apiKey = agent.config?.VYBE_API_KEY;
    if (!apiKey) throw new Error("Missing VYBE_API_KEY in agent config");

    const { programAddress, resolution } = input;
    const url = `https://api.vybenetwork.xyz/program/${programAddress}/tvl?resolution=${resolution}`;

    try {
        const res = await fetch(url, {
            headers: {
                "X-API-KEY": apiKey,
                accept: "application/json",
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error?.message || "Failed to fetch program TVL");
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
