require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.5.5" },
      { version: "0.6.6" },
      { version: "0.8.8" },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        // ETH mainnet
        // url: process.env.ETH_RPC,

        url: process.env.BSC_RPC, // BSC netowrk
        // blockNumber: 14390000
      },
    },
    testnet: {
      url: "https://bsc-testnet.bnbchain.org",
      account: [
        "", // add PK for testnet deployment
      ],
    },
    mainnet: {
      url: "https://bsc-dataseed3.binance.org/", // BSC
    },
  },
};
