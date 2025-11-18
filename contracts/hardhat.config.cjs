require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    moonbase: {
      chainId: 1287,
      // Try alternative RPC endpoints if main one fails
      url: process.env.MOONBASE_RPC_URL || "https://moonbeam-alpha.api.onfinality.io/public",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 120000, // 120 seconds
      gasPrice: "auto",
    },
    moonbeam: {
      chainId: 1284,
      url: "https://rpc.api.moonbeam.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      moonbase: process.env.MOONSCAN_API_KEY || "",
      moonbeam: process.env.MOONSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "moonbase",
        chainId: 1287,
        urls: {
          apiURL: "https://api-moonbase.moonscan.io/api",
          browserURL: "https://moonbase.moonscan.io",
        },
      },
      {
        network: "moonbeam",
        chainId: 1284,
        urls: {
          apiURL: "https://api-moonbeam.moonscan.io/api",
          browserURL: "https://moonscan.io",
        },
      },
    ],
  },
  paths: {
    sources: "./",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
