require("@nomicfoundation/hardhat-toolbox");

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
        url: "https://bsc-dataseed3.binance.org/",
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
