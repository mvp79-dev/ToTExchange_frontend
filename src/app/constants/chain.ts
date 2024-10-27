export const BSCChain = {
  chainName: process.env.REACT_APP_BNB_CHAIN_NAME,
  chainId: process.env.REACT_APP_BNB_CHAIN_ID as `0x${string}`,
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: (process.env.REACT_APP_BNB_CHAIN_RPC_URL ?? "").split(","),
  blockExplorerUrls: [process.env.REACT_APP_BNB_CHAIN_BLOCK_EXPLORER],
};
