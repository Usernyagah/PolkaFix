import { http, createConfig } from 'wagmi';
import { moonbaseAlpha, moonbeam } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

const projectId = import.meta.env.VITE_PROJECT_ID_WALLETCONNECT || 'demo-project-id';

const metadata = {
  name: 'PolkaFix',
  description: 'Decentralized Bug Bounty Platform on Moonbeam',
  url: 'https://polkafix.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig = defaultWagmiConfig({
  chains: [moonbaseAlpha, moonbeam],
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
});
