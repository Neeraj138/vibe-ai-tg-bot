"use strict";
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
const web3_js_1 = require("@solana/web3.js");
const solana_agent_kit_1 = require("solana-agent-kit");
const my_plugin_1 = __importDefault(require("./my-plugin"));
const openai_1 = require("@langchain/openai");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
const axios_1 = __importDefault(require("axios"));
// 1. Load environment
(0, dotenv_1.config)();
// 2. Wallet and Agent
const kpBytes = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY));
const kp = web3_js_1.Keypair.fromSecretKey(kpBytes);
const wallet = new solana_agent_kit_1.KeypairWallet(kp, process.env.RPC_URL);
const agent = new solana_agent_kit_1.SolanaAgentKit(wallet, process.env.RPC_URL, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    VYBE_API_KEY: process.env.VYBE_API_KEY,
}).use(my_plugin_1.default);
const tools = (0, solana_agent_kit_1.createLangchainTools)(agent, agent.actions);
const memory = new langgraph_1.MemorySaver();
const llm = new openai_1.ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});
llm.bindTools(tools);
const langchainAgent = (0, prebuilt_1.createReactAgent)({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `You are a helpful agent that can interact onchain using the Solana Agent Kit. Be concise and helpful.`,
});
// 3. Express Setup
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json("tg server for vibe bot");
});
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
// 4. Async Handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// 5. Rate Limiting + Memory Setup
const userLastMessageTime = new Map();
const userMemory = new Map(); // NEW!
const RATE_LIMIT_MS = 3000; // 3 seconds
// --- Inside the POST /webhook handler ---
app.post("/webhook", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = req.body.message;
    if (!message || !message.text) {
        return res.sendStatus(200);
    }
    const chatId = message.chat.id;
    const userInput = message.text.trim();
    // --- Rate limit ---
    const now = Date.now();
    const lastTime = userLastMessageTime.get(chatId) || 0;
    if (now - lastTime < RATE_LIMIT_MS) {
        yield axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: "⏳ Please wait a few seconds before sending another message!",
        });
        return res.sendStatus(200);
    }
    userLastMessageTime.set(chatId, now);
    try {
        yield axios_1.default.post(`${TELEGRAM_API_URL}/sendChatAction`, {
            chat_id: chatId,
            action: "typing",
        });
        // --- Handle /start and /help ---
        if (userInput === "/start") {
            yield axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: `👋 Hello! I am your Solana agent. You can just chat with me normally.`,
            });
            return res.sendStatus(200);
        }
        if (userInput === "/help") {
            yield axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: `ℹ️ Ask anything like "Show me $SEND holders" or "TVL of Zeta Markets".`,
            });
            return res.sendStatus(200);
        }
        // --- Handle user chat ---
        // Fetch user's chat history
        // Fetch user's chat history
        const memory = userMemory.get(chatId) || { messages: [] };
        // Always add new *user* message
        memory.messages.push(new messages_1.HumanMessage(userInput));
        const response = yield langchainAgent.invoke({
            messages: memory.messages,
        }, {
            configurable: {
                thread_id: `telegram-${chatId}`,
            },
        });
        // --- Debug Logs ---
        const toolCalls = response.messages
            .filter(messages_1.isAIMessage)
            .filter((m) => Array.isArray(m.tool_calls) && m.tool_calls.length > 0);
        if (toolCalls.length > 0) {
            console.log(`\n🔧 Tool Calls for chat ${chatId}:`);
            for (const msg of toolCalls) {
                for (const tc of msg.tool_calls) {
                    console.log(`- 🛠️ ${tc.name} called with args:`, tc.args);
                }
            }
        }
        const toolResults = response.messages.filter(messages_1.isToolMessage);
        if (toolResults.length > 0) {
            console.log(`\n🧪 Tool Results:`);
            for (const result of toolResults) {
                console.log(`- ✅ ${result.name} responded with:`, result.content);
            }
        }
        userMemory.set(chatId, memory); // Save updated memory back
        // --- Final agent reply ---
        const aiMessages = response.messages.filter(messages_1.isAIMessage);
        const finalReply = ((_a = aiMessages.at(-1)) === null || _a === void 0 ? void 0 : _a.content) || "🤖 [No response]";
        yield axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: typeof finalReply === "string"
                ? finalReply
                : JSON.stringify(finalReply),
        });
    }
    catch (error) {
        console.error("Telegram Bot Error:", error);
        yield axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: "⚠️ Sorry, there was an error processing your request. Please try again.",
        });
    }
    res.sendStatus(200);
})));
// 7. Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Telegram bot server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map