"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const readline = __importStar(require("node:readline"));
const web3_js_1 = require("@solana/web3.js");
const solana_agent_kit_1 = require("solana-agent-kit");
const langgraph_1 = require("@langchain/langgraph");
const openai_1 = require("@langchain/openai");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const messages_1 = require("@langchain/core/messages");
const my_plugin_1 = __importDefault(require("./my-plugin"));
(0, dotenv_1.config)(); // Load environment variables
// Express setup (not used in CLI yet)
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json("server for vybe tg bot");
});
// Wallet setup
const kpBytes = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY));
const kp = web3_js_1.Keypair.fromSecretKey(kpBytes);
const wallet = new solana_agent_kit_1.KeypairWallet(kp, process.env.RPC_URL);
// Solana agent with token plugin
const agent = new solana_agent_kit_1.SolanaAgentKit(wallet, process.env.RPC_URL, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    VYBE_API_KEY: process.env.VYBE_API_KEY,
}).use(my_plugin_1.default);
// Generate tools from agent actions
const tools = (0, solana_agent_kit_1.createLangchainTools)(agent, agent.actions);
console.log("🔧 Loaded Tools:", agent.actions.map((a) => a.name));
// LangGraph memory + LLM setup
const memory = new langgraph_1.MemorySaver();
const llm = new openai_1.ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});
llm.bindTools(tools);
// Create LangGraph agent
const langchainAgent = (0, prebuilt_1.createReactAgent)({
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
function ask() {
    return __awaiter(this, void 0, void 0, function* () {
        rl.question("🧠 You: ", (userInput) => __awaiter(this, void 0, void 0, function* () {
            if (userInput.toLowerCase() === "exit") {
                rl.close();
                return;
            }
            try {
                const res = yield langchainAgent.invoke({
                    messages: [new messages_1.HumanMessage(userInput)],
                }, {
                    configurable: {
                        thread_id: "terminal-chat",
                    },
                });
                // Log tool calls
                const toolCalls = res.messages.filter(messages_1.isAIMessage).filter((m) => Array.isArray(m.tool_calls) && m.tool_calls.length > 0);
                if (toolCalls.length > 0) {
                    console.log("\n🔧 Tool Calls:");
                    for (const msg of toolCalls) {
                        for (const tc of msg.tool_calls) {
                            console.log(`- 🛠️ ${tc.name} called with args:`, tc.args);
                        }
                    }
                }
                // Log tool results
                const toolResults = res.messages.filter(messages_1.isToolMessage);
                if (toolResults.length > 0) {
                    console.log("\n🧪 Tool Results:");
                    for (const result of toolResults) {
                        console.log(`- ✅ ${result.name} responded with:`, result.content);
                    }
                }
                // Final AI message
                const aiMessages = res.messages.filter(messages_1.isAIMessage);
                const aiMessage = aiMessages.at(-1);
                console.log("\n🤖 Agent:", (aiMessage === null || aiMessage === void 0 ? void 0 : aiMessage.content) || "[No response]");
            }
            catch (err) {
                console.error("❌ Agent Error:", err);
            }
            ask();
        }));
    });
}
ask();
// To expose HTTP API later, uncomment below:
// app.listen(3001, () => {
//   console.log("backend listening on http://localhost:3001");
// });
//# sourceMappingURL=index.js.map