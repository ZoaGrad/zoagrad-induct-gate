const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrownKey", function () {
  async function deployCrownKey() {
    const [owner, other] = await ethers.getSigners();
    const CrownKey = await ethers.getContractFactory("CrownKey");
    const crownKey = await CrownKey.deploy("ipfs://base/", 1n); // supply cap 1
    await crownKey.waitForDeployment();
    return { crownKey, owner, other };
  }

  it("returns correct tokenURI", async function () {
    const { crownKey, owner } = await deployCrownKey();
    await crownKey.safeMint(owner.address);
    expect(await crownKey.tokenURI(0n)).to.equal("ipfs://base/0");
  });

  it("enforces supply cap", async function () {
    const { crownKey, owner } = await deployCrownKey();
    await crownKey.safeMint(owner.address);
    await expect(crownKey.safeMint(owner.address)).to.be.revertedWith(
      "Max supply reached"
    );
  });

  it("allows burning tokens", async function () {
    const { crownKey, owner } = await deployCrownKey();
    await crownKey.safeMint(owner.address);
    await crownKey.burn(0n);
    await expect(crownKey.ownerOf(0n)).to.be.reverted;
  });
});

