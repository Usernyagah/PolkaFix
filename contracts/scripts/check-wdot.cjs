const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [signer] = await ethers.getSigners();
  const wDOTAddress = process.env.MOONBASE_WDOT || "0xd909178CC99d318e4D1390dC624800C34066DC6c";
  
  console.log("Checking wDOT contract...");
  console.log("Wallet address:", signer.address);
  console.log("wDOT contract:", wDOTAddress);

  // Standard ERC20 ABI
  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function totalSupply() view returns (uint256)",
    // Check if it's a WETH-like contract with deposit function
    "function deposit() payable",
    "function depositTo(address to) payable",
  ];

  const wDOT = new ethers.Contract(wDOTAddress, erc20Abi, signer);

  try {
    const [balance, decimals, symbol, name, totalSupply] = await Promise.all([
      wDOT.balanceOf(signer.address).catch(() => ethers.parseEther("0")),
      wDOT.decimals().catch(() => 18),
      wDOT.symbol().catch(() => "wDOT"),
      wDOT.name().catch(() => "Wrapped DOT"),
      wDOT.totalSupply().catch(() => ethers.parseEther("0")),
    ]);

    console.log("\n=== wDOT Contract Info ===");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log("Total Supply:", ethers.formatEther(totalSupply), symbol);
    console.log("\n=== Your Balance ===");
    console.log("wDOT Balance:", ethers.formatEther(balance), symbol);
    
    if (balance === 0n) {
      console.log("\n⚠️  You don't have any wDOT tokens.");
      console.log("\nOptions to get wDOT:");
      console.log("1. Join Moonbeam Discord: https://discord.gg/moonbeam");
      console.log("   - Request wDOT tokens in the testnet channel");
      console.log("2. Check if wDOT contract supports wrapping:");
      console.log("   - Visit: https://moonbase.moonscan.io/address/" + wDOTAddress + "#code");
      console.log("   - Look for 'deposit' or 'wrap' functions");
      console.log("3. Deploy contract anyway (you can get wDOT later for testing)");
    } else {
      console.log("\n✅ You have wDOT tokens! You can post bounties.");
    }

    // Check if contract has deposit function
    try {
      const depositFragment = wDOT.interface.getFunction("deposit");
      if (depositFragment) {
        console.log("\n✅ This contract supports deposit() - you can wrap DEV to wDOT!");
        console.log("   To wrap: Send DEV to the contract address or call deposit()");
      }
    } catch (e) {
      // No deposit function
    }

  } catch (error) {
    console.error("Error checking wDOT contract:", error.message);
    console.log("\nYou can still deploy the contract - wDOT is only needed for posting bounties.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

