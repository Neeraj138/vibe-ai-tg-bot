import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { Keypair } from "@solana/web3.js";
import {
  KeypairWallet,
  SolanaAgentKit,
  createLangchainTools,
} from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import MyPlugin from "./my-plugin";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import {
  HumanMessage,
  isAIMessage,
  isToolMessage,
} from "@langchain/core/messages";
import axios from "axios";

// 1. Load environment
config();

// 2. Wallet and Agent
const kpBytes = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!));
const kp = Keypair.fromSecretKey(kpBytes);
const wallet = new KeypairWallet(kp, process.env.RPC_URL!);

const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  VYBE_API_KEY: process.env.VYBE_API_KEY!,
} as any).use(MyPlugin);

const tools = createLangchainTools(agent, agent.actions);
const memory = new MemorySaver();
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});
llm.bindTools(tools);

const langchainAgent = createReactAgent({
  llm,
  tools,
  checkpointSaver: memory,
  messageModifier: `You are a helpful agent that can interact onchain using the Solana Agent Kit. Be concise and helpful.`,
});

// 3. Express Setup
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.json("tg server for vibe bot")
})

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// 4. Async Handler
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 5. Rate Limiting + Memory Setup
const userLastMessageTime = new Map<number, number>();
const userMemory = new Map<number, { messages: HumanMessage[] }>(); // NEW!
const RATE_LIMIT_MS = 3000; // 3 seconds

// --- Inside the POST /webhook handler ---
app.post(
  "/webhook",
  asyncHandler(async (req: Request, res: Response) => {
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
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: "⏳ Please wait a few seconds before sending another message!",
      });
      return res.sendStatus(200);
    }
    userLastMessageTime.set(chatId, now);

    try {
      await axios.post(`${TELEGRAM_API_URL}/sendChatAction`, {
        chat_id: chatId,
        action: "typing",
      });

      // --- Handle /start and /help ---
      if (userInput === "/start") {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
          chat_id: chatId,
          text: `👋 Hello! I am your Solana agent. You can just chat with me normally.`,
        });
        return res.sendStatus(200);
      }
      if (userInput === "/help") {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
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
      memory.messages.push(new HumanMessage(userInput));

      const response = await langchainAgent.invoke(
        {
          messages: memory.messages,
        },
        {
          configurable: {
            thread_id: `telegram-${chatId}`,
          },
        }
      );

      // --- Debug Logs ---
      const toolCalls = response.messages
        .filter(isAIMessage)
        .filter((m) => Array.isArray(m.tool_calls) && m.tool_calls.length > 0);
      if (toolCalls.length > 0) {
        console.log(`\n🔧 Tool Calls for chat ${chatId}:`);
        for (const msg of toolCalls) {
          for (const tc of msg.tool_calls!) {
            console.log(`- 🛠️ ${tc.name} called with args:`, tc.args);
          }
        }
      }

      const toolResults = response.messages.filter(isToolMessage);
      if (toolResults.length > 0) {
        console.log(`\n🧪 Tool Results:`);
        for (const result of toolResults) {
          console.log(`- ✅ ${result.name} responded with:`, result.content);
        }
      }

      userMemory.set(chatId, memory); // Save updated memory back

      // --- Final agent reply ---
      const aiMessages = response.messages.filter(isAIMessage);
      const finalReply = aiMessages.at(-1)?.content || "🤖 [No response]";

      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text:
          typeof finalReply === "string"
            ? finalReply
            : JSON.stringify(finalReply),
      });
    } catch (error) {
      console.error("Telegram Bot Error:", error);
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: "⚠️ Sorry, there was an error processing your request. Please try again.",
      });
    }

    res.sendStatus(200);
  })
);

// 7. Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Telegram bot server running on port ${PORT}`);
});
