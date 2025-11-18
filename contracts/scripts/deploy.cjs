const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const wDOTAddress = process.env.MOONBASE_WDOT;
  if (!wDOTAddress) {
    throw new Error("MOONBASE_WDOT environment variable is not set");
  }

  // Ensure address is properly checksummed
  const checksummedAddress = ethers.getAddress(wDOTAddress);
  console.log("Deploying PolkaFix with wDOT address:", checksummedAddress);

  const PolkaFix = await ethers.getContractFactory("PolkaFix");
  const polkaFix = await PolkaFix.deploy(checksummedAddress);

  await polkaFix.waitForDeployment();

  const contractAddress = await polkaFix.getAddress();
  console.log("PolkaFix deployed to:", contractAddress);

  // Save address to file for verification script
  const addressPath = path.join(__dirname, "..", "address.txt");
  fs.writeFileSync(addressPath, contractAddress);

  // Update client .env.local
  const frontendEnvPath = path.join(__dirname, "..", "..", "client", ".env.local");
  const envContent = `VITE_CONTRACT_ADDRESS_MOONBASE=${contractAddress}
VITE_WDOT_ADDRESS_MOONBASE=${checksummedAddress}
`;

  fs.writeFileSync(frontendEnvPath, envContent);
  console.log("Updated client/.env.local with contract address");

  console.log("\nDeployment successful!");
  console.log("Contract address:", contractAddress);
  console.log("Network: Moonbase Alpha");
  console.log("Explorer: https://moonbase.moonscan.io/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

