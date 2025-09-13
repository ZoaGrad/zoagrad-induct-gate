const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const crownKeyAbi = require("../artifacts/contracts/CrownKey.sol/CrownKey.json").abi;
  const crownKey = new ethers.Contract(
    process.env.CROWNKEY_ADDRESS,
    crownKeyAbi,
    wallet
  );

  const tx = await crownKey.safeMint(wallet.address);
  await tx.wait();

  console.log(`Minted token to ${wallet.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
