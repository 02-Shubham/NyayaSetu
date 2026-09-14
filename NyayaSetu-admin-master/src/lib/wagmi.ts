import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [sepolia, mainnet, localhost, hardhat],
    connectors: [
        injected(),
    ],
    transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
        [mainnet.id]: http(),
        [localhost.id]: http(),
        [hardhat.id]: http(),
    },
})
