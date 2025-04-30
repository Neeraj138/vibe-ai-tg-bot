# Vybe AI Telegram Bot — Built with SolanaAgentKit and Vybe Network API

The bot is still in its early stages and currently rate-limited due to my budget constraints for OpenAI API credits. As a result, response times may be slow and answers may occasionally be inaccurate.  
**Repository**: [https://github.com/Neeraj138/vibe-ai-tg-bot/tree/main](https://github.com/Neeraj138/vibe-ai-tg-bot/tree/main)

This is a conversational Telegram bot that enables natural language interaction with on-chain Solana data. Built using [SolanaAgentKit](https://kit.sendai.fun/) and [Vybe Network APIs](https://docs.vybenetwork.com/reference/get_known_accounts), the bot supports rich query capabilities across tokens, wallets, programs, and protocols.

## Features

- Natural language support for all interactions
- Fully conversational Telegram experience (no commands required)
- Integrates Vybe Network APIs for Solana on-chain data
- Supports both Telegram messages and CLI usage
- Memory and tool chaining via LangGraph + LangChain
- Typed plugin system with validation using Zod

## Project Structure

```
vybe-ai-tg-bot/
├── package.json
├── tsconfig.json
├── vercel.json
├── src/
│   ├── index.ts                  # Agent REPL (CLI)
│   ├── telegram-server.ts        # Telegram webhook server
│   ├── types/                    # SolanaAgentKit type extensions
│   └── my-plugin/                # Custom Vybe plugin
│       ├── actions/              # LangChain action definitions
│       ├── tools/                # Tool implementations
│       ├── types/                # Zod validation schemas
│       └── utils/                # Helpers and label normalization
```

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/Neeraj138/vibe-ai-tg-bot.git
cd vibe-ai-tg-bot/backend
nvm use --lts
yarn install
```

### 2. Environment Setup

Create a `.env` file with the following values:

```env
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
OPENAI_API_KEY=<your_openai_api_key>
VYBE_API_KEY=<your_vybe_api_key>
SOLANA_PRIVATE_KEY=<keypair_in_json_array_format>
RPC_URL=https://api.mainnet-beta.solana.com
```

### 3. Local Development

Start in CLI (terminal prompt):

```bash
yarn dev
```

Build and run HTTP server (e.g., for Telegram):

```bash
yarn build
yarn start
```

## Deployment

The project includes a `vercel.json` config to deploy the Express server as a serverless function on [Vercel](https://vercel.com/).

To set up the Telegram webhook after deployment:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<your-vercel-app>.vercel.app/webhook"
```

## Agent Architecture

The LangGraph-based agent uses OpenAI's GPT model with tools generated via SolanaAgentKit. Vybe API integrations are added via a custom plugin inside `src/my-plugin`.

```
Telegram → Express → LangGraph Agent → SolanaAgentKit Tools → Vybe API → Solana
```

## Testing the Bot

Use natural language questions to trigger tool actions. Example queries by category:

### Known Accounts
- show known Solana accounts for defi
- get me amm wallets
- fetch hacker addresses

### Token Balances
- what tokens does this wallet hold?
- show only verified tokens in this wallet
- which SPL tokens are in this address?

### NFT Balances
- what NFTs are in this wallet?
- show NFT portfolio value
- list 5 NFTs from this address

### Wallet PnL
- get PnL performance of wallet X for the last 30 days
- which token made the most profit for this wallet?

### Programs
- show all programs from Star Atlas
- list programs with category DEFI and NFT
- get average number of instructions per user for program X

### Token Transfers
- show token transfers for SEND token in the last 24 hours
- find all tokens received by a wallet
- list top transfers by USD value

### Token Metrics
- what’s the current price and market cap of token X?
- show daily volume and holder count of SEND token
- get top token holders by balance

A full list of example queries for each tool is available in the [project documentation](https://github.com/Neeraj138/vibe-ai-tg-bot/tree/main).

## Notes

- Per-user memory context is maintained using thread ID (for multi-turn interactions)
- Tool calls and responses are logged to console
- Telegram typing indicator is displayed while agent processes requests
- Rate-limited with basic in-memory throttling

## License

MIT License. Created and maintained by [Neeraj138](https://github.com/Neeraj138).
