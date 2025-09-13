const hre = require("hardhat");

async function main() {
  const crownKey = await hre.ethers.deployContract("CrownKey");

  await crownKey.waitForDeployment();

  console.log(
    `CrownKey deployed to ${crownKey.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
