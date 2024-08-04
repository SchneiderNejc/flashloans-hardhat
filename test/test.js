const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { impersonateFundErc20 } = require("../utils/utilities");

const { abi } = require(".../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");

const provider = waffle.provider;

describe("FlashSwap Contract", () => {
    let FLASHSWAP, BORROW_AMOUNT, FUND_AMOUNT, initiateFundHuman, txArbitrage, gasUsedUSD;
    
    const BUSD_WHALE;
    const BUSD;
    const USDT;
    const CAKE;
    const CROX;

    const BASE_TOKEN_ADDRESS = BUSD;

    const tokenBase = new ethers.Contract(BASE_TOKEN_ADDRESS, abi, provider);
    });
});