export const addressConfig = {
  WhistleblowerPortal: process.env.NEXT_PUBLIC_PORTAL_ADDRESS || "0xB6C0c96Cd13D15a312FCBBD2254bE9622615661e",
  ShadowVault: process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x4c735a6a1717f4281aDe5Ac80DC08FeEFD865300",
  CivicChainRegistry: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0xeCCd34958B277c63799dC8f7D82c734172f74cF2",
  DeadManSwitch: process.env.NEXT_PUBLIC_DEADMAN_ADDRESS || "0xfE174Ff624b07db1Bf03664c2521732bA7a040EB",
  Groth16Verifier: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS || "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
  network: process.env.NEXT_PUBLIC_NETWORK_NAME || "sepolia",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11155111
} as const
