require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Uniswap V2 Router (example – change per chain)
const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const routerAbi = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory)",
];

const router = new ethers.Contract(ROUTER, routerAbi, wallet);

const WETH = "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2";
const TARGET_TOKEN = "0xTOKEN_ADDRESS";

async function trade() {
  const amountIn = ethers.parseEther("0.01");

  const amounts = await router.getAmountsOut(amountIn, [WETH, TARGET_TOKEN]);
  const minOut = amounts[1] * 95n / 100n; // 5% slippage protection

  const tx = await router.swapExactETHForTokens(
    minOut,
    [WETH, TARGET_TOKEN],
    wallet.address,
    Math.floor(Date.now() / 1000) + 60,
    { value: amountIn }
  );

  console.log("Trade sent:", tx.hash);
}

trade().catch(console.error);
