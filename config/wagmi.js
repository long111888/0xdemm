import { connectorsForWallets} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig } from "wagmi";
import { createPublicClient, http } from 'viem'
import { mainnet, goerli, arbitrumGoerli, arbitrum, bscTestnet, bsc} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bscTestnet],
    [
        jsonRpcProvider({ rpc: (chain) =>  {
            if (chain.id == 97) {
                return {
                    // http: "https://data-seed-prebsc-1-s1.binance.org:8545",
                    http: "https://bsc-testnet.publicnode.com",
                }
            } else if (chain.id == 421613 ) {
                return {
                    http: "https://goerli-rollup.arbitrum.io/rpc"
                }
            }

            return {
                http: `${chain.rpcUrls.default}`,
                }
            },
       }),
        publicProvider(),
    ],
);

// const needsInjectedWalletFallback =
//     typeof window !== "undefined" &&
//     window.ethereum &&
//     !window.ethereum.isMetaMask &&
//     !window.ethereum.isCoinbaseWallet;
const connectors = connectorsForWallets([
    {
        groupName: "Popular",
        wallets: [
            injectedWallet({chains}),
            metaMaskWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains }),
            trustWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains }),
            walletConnectWallet({ projectId: "1ecbab09b9b8ddac73ebc54d1190788c", chains }),
            // wallet.coinbase({ appName: "Coinbase", chains }),
            // ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
        ],
    }
]);

export const wagmiClient = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});