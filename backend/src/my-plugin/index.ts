import type { Plugin, SolanaAgentKit } from "solana-agent-kit";
import * as VybenetworkTools from "./vybenetwork/tools";
import * as VybenetworkActions from "./vybenetwork/actions";
/**
 * Custom plugin for integrating Vybe Network APIs into SolanaAgentKit.
 */
const MyPlugin: Plugin = {
  name: "myplugin",

  methods: {
    ...VybenetworkTools,
  },

  actions: [
    VybenetworkActions.getKnownAccountsAction,
    VybenetworkActions.getTokenBalancesAction,
    VybenetworkActions.getNftBalancesAction,
    VybenetworkActions.getWalletPnlAction,
    VybenetworkActions.getTokenBalancesTimeSeriesAction,
    VybenetworkActions.getKnownProgramsAction,
    VybenetworkActions.getProgramDetailsAction,
    VybenetworkActions.getProgramActiveUsersAction,
    VybenetworkActions.getProgramActiveUsersTSAction,
    VybenetworkActions.getProgramTransactionsTSAction,
    VybenetworkActions.getProgramTvlTSAction,
    VybenetworkActions.getProgramsListAction,
    VybenetworkActions.getTokenTransfersAction,
    VybenetworkActions.getTokenDetailsAction,
    VybenetworkActions.getTokenHoldersTimeSeriesAction,
    VybenetworkActions.getTopTokenHoldersAction,
    VybenetworkActions.getTokenVolumeTimeSeriesAction,
    
  ],

  initialize(agent: SolanaAgentKit) {
    Object.entries(this.methods).forEach(([name, fn]) => {
      if (typeof fn === "function") {
        this.methods[name] = fn.bind(null, agent);
      }
    });
  },
};

export default MyPlugin;
