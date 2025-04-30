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
Object.defineProperty(exports, "__esModule", { value: true });
const VybenetworkTools = __importStar(require("./vybenetwork/tools"));
const VybenetworkActions = __importStar(require("./vybenetwork/actions"));
/**
 * Custom plugin for integrating Vybe Network APIs into SolanaAgentKit.
 */
const MyPlugin = {
    name: "myplugin",
    methods: Object.assign({}, VybenetworkTools),
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
    initialize(agent) {
        Object.entries(this.methods).forEach(([name, fn]) => {
            if (typeof fn === "function") {
                this.methods[name] = fn.bind(null, agent);
            }
        });
    },
};
exports.default = MyPlugin;
//# sourceMappingURL=index.js.map