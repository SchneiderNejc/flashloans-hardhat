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

    beforeEach(async () => {
        // Get owner as signer
        [owner] = await ethers.getSigners();

        // Ensure that the whale has a balance
        const whale_balance = await provider.getBalance(BUSD_WHALE);
        expect(whale_balance).not.equal("0");

        // Deploy smart contract
        const FlashSwap = await ethers.getContractFactory("PancakeFlashSwap");
        FLASHSWAP = await FlashSwap.deploy();
        await FLASHSWAP.deployed();

        // Configure our Borrowing
        const borrowAmountHuman = "1";

        BORROW_AMOUNT =     ethers.utils.parseUnits(borrowAmountHuman, DECIMALS)

        // Configure Funding
        initialFundingHuman = "100";
        FUND_AMOUNT = ethers.utils.parseUnits(initialFundingHuman, DECIMALS);

        // Fund our Contract - For testing only
        await impersonateFundErc20(tokenBase, BUSD_WHALE, FLASHSWAP.address, initialFundingHuman)
    });
});