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
        // GOTTA UPDATE THE FOLLOWING LINE TO FORK!!
        url: process.env.MORALIS_RPC,
        // blockNumber: 14390000
      },
    },
    testnet: {
      url: "https://bsc-testnet.bnbchain.org",
      chainId: 97,
      account: [
        "", // add PK for testnet deployment
      ],
    },
    mainnet: {
      url: "https://bsc-dataseed3.binance.org/",
      chainId: 56,
    },
  },
};
