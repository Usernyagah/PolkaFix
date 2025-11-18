const { run } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const addressPath = require("path").join(__dirname, "..", "address.txt");
  const contractAddress = fs.readFileSync(addressPath, "utf-8").trim();
  const wDOTAddress = process.env.MOONBASE_WDOT;

  if (!wDOTAddress) {
    throw new Error("MOONBASE_WDOT environment variable is not set");
  }

  console.log("Verifying contract at:", contractAddress);
  console.log("Constructor args:", wDOTAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [wDOTAddress],
    });
    console.log("Contract verified successfully!");
    console.log("View on Moonscan: https://moonbase.moonscan.io/address/" + contractAddress);
  } catch (error) {
    if (error.message && error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified!");
    } else {
      console.error("Verification failed:", error.message || error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

