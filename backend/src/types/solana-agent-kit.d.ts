import "solana-agent-kit";

declare module "solana-agent-kit" {
  interface Config {
    VYBE_API_KEY?: string;
  }
}