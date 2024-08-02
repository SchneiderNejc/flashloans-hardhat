pragma solidity 0.6.6;

import "hardhat/console.sol";

// Uniswap interface and library imports
import "./libraries/UniswapV2Library.sol";
import "./interfaces/IUniswapV2Router01.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeERC20.sol";

contract FlashSwap {
    using SafeERC20 for IERC20;

    // Factory and Routing address
    address constant PANCAKE_FACTORY =
        0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    address constant PANCAKE_ROUTER =
        0x10ED43C718714eb63d5aA57B78B54704E256024E;

    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address private constant BUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address private constant USDC = 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
    address private constant CAKE = 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82;

    // FUND SMART CONTRACT
    // Provides a function to allow contract to be funded.
    function deposit(
        address _owner,
        address _token,
        uint _amount
    ) public {
        IERC20(_token).transferFrom(_owner, address(this), _amount);
    }

    // GET CONTRACT BALANCE
    // Allows public view of balance for contract
    function getBalanceOfToken(address _address) public view returns (uint) {
        return IERC20(_address).balanceOf(address(this));
    }

    // PLACE A TRADE
    // Executed placing a trade
    function placeTrade(
        address _fromToken,
        address _toToken,
        uint _amountIn
    ) private returns (uint) {
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(_fromToken, _toToken);
        require(pair != address(0), "Pool does not exist.");

        // Calculate amount out. 
        address[] memory path = new address[](2);
        path[0] = _fromToken;
        path[1] = _toToken;

        uint amountRequired = IUniswapV2Router01(PANCAKE_ROUTER).getAmountsOut(_amountIn, path)[1];
        console.log("amountRequired: ",amountRequired);

        // Trade variable
        uint private deadline = block.timestamp + 1 days;

        // Perform Arbitrage - Swap for another token
        uint amountReceived = IUniswapV2Router01(PANCAKE_ROUTER).swapExactTokensForTokens(
            _amountIn,
            amountRequired,
            path,
            address(this),
            deadline
        )[1];
        
        console.log("amountReceived: ",amountReceived);
        require(amountReceived > 0, "Aborted tx: Trade returnded zero");

        return amountReceived;
    }

    // INITIATE ARBITRAGE
    // Begins receiving loan to perform arbitrage trades
    function startArbitrage(address _tokenBorrow, uint _amount) external {
        IERC20(WBNB).safeApprove(address(PANCAKE_ROUTER), UINT_MAX);
        IERC20(BUSD).safeApprove(address(PANCAKE_ROUTER), UINT_MAX);
        IERC20(USDC).safeApprove(address(PANCAKE_ROUTER), UINT_MAX);
        IERC20(CAKE).safeApprove(address(PANCAKE_ROUTER), UINT_MAX);

        // Get the Factory Pair address for combined tokens
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(_tokenBorrow, WBNB);
    
        // Return error if combination does not exist
        require(pair != address(0), "Pool does not exist");

        // fIGURE OUT WHICH TOKEN (0 OR 1) has the amount and assign
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;

        // Passing data as bytes so that the 'swap' function knows it is a flashloan
        bytes memory data = abi.encode(_tokenBorrow, _amount, msg.sender);

        // Execute the initial swap to get the loan
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }
    
}