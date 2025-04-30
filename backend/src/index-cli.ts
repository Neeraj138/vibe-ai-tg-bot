import express from "express";
import { config } from "dotenv";
import * as readline from "node:readline";
import { Keypair } from "@solana/web3.js";
import { KeypairWallet, SolanaAgentKit, createLangchainTools } from "solana-agent-kit";

import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
    HumanMessage,
    isAIMessage,
    isToolMessage,
} from "@langchain/core/messages";
import MyPlugin from "./my-plugin";

config(); // Load environment variables

// Express setup (not used in CLI yet)
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json("server for vybe tg bot")
})

// Wallet setup
const kpBytes = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!));
const kp = Keypair.fromSecretKey(kpBytes);
const wallet = new KeypairWallet(kp, process.env.RPC_URL!);

// Solana agent with token plugin
const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    VYBE_API_KEY: process.env.VYBE_API_KEY!,
} as any).use(MyPlugin);

// Generate tools from agent actions
const tools = createLangchainTools(agent, agent.actions);
console.log("🔧 Loaded Tools:", agent.actions.map((a) => a.name));

// LangGraph memory + LLM setup
const memory = new MemorySaver();
const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});
llm.bindTools(tools);

// Create LangGraph agent
const langchainAgent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
    empowered to interact onchain using your tools. If you need funds you can request it from the user and provide your wallet details. If there is a 5XX
    (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
    can't do with your currently available tools, you must say so, and encourage them to implement it
    themselves using the Solana Agent Kit. Recommend they go to https://www.solanaagentkit.xyz for more information. Be
    concise and helpful with your responses.`,
});

// CLI prompt loop
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function ask() {
    rl.question("🧠 You: ", async (userInput) => {
        if (userInput.toLowerCase() === "exit") {
            rl.close();
            return;
        }

        try {
            const res = await langchainAgent.invoke(
                {
                    messages: [new HumanMessage(userInput)],
                },
                {
                    configurable: {
                        thread_id: "terminal-chat",
                    },
                }
            );

            // Log tool calls
            const toolCalls = res.messages.filter(isAIMessage).filter(
                (m) => Array.isArray(m.tool_calls) && m.tool_calls.length > 0
            );

            if (toolCalls.length > 0) {
                console.log("\n🔧 Tool Calls:");
                for (const msg of toolCalls) {
                    for (const tc of msg.tool_calls!) {
                        console.log(`- 🛠️ ${tc.name} called with args:`, tc.args);
                    }
                }
            }

            // Log tool results
            const toolResults = res.messages.filter(isToolMessage);
            if (toolResults.length > 0) {
                console.log("\n🧪 Tool Results:");
                for (const result of toolResults) {
                    console.log(`- ✅ ${result.name} responded with:`, result.content);
                }
            }

            // Final AI message
            const aiMessages = res.messages.filter(isAIMessage);
            const aiMessage = aiMessages.at(-1);
            console.log("\n🤖 Agent:", aiMessage?.content || "[No response]");
        } catch (err) {
            console.error("❌ Agent Error:", err);
        }

        ask();
    });
}

ask();

// To expose HTTP API later, uncomment below:
// app.listen(3001, () => {
//   console.log("backend listening on http://localhost:3001");
// });
