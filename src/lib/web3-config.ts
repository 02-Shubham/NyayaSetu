import { http, createConfig } from 'wagmi'
import { localhost, sepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

// Define localhost chain with proper configuration
export const localhostChain = {
  ...localhost,
  id: 1337,
  name: 'Localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
}

// Wagmi configuration - supports both Sepolia testnet and Localhost
export const config = createConfig({
  chains: [sepolia, localhostChain],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
    [localhostChain.id]: http('http://127.0.0.1:8545'),
  },
  ssr: false,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
