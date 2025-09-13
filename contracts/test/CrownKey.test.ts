import { expect } from "chai";
import { ethers } from "hardhat";

describe("CrownKey", function () {
  async function deploy() {
    const [owner, other] = await ethers.getSigners();
    const CrownKey = await ethers.getContractFactory("CrownKey");
    const crownKey = await CrownKey.deploy();
    await crownKey.waitForDeployment();
    return { crownKey, owner, other };
  }

  it("deploys successfully", async function () {
    const { crownKey } = await deploy();
    expect(await crownKey.name()).to.equal("CrownKey");
  });

  it("only owner can call safeMint", async function () {
    const { crownKey, owner, other } = await deploy();
    await expect(crownKey.connect(owner).safeMint(owner.address)).to.not.be.reverted;
    await expect(crownKey.connect(other).safeMint(other.address)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("increments token IDs and updates balances", async function () {
    const { crownKey, owner, other } = await deploy();
    await crownKey.safeMint(owner.address);
    expect(await crownKey.ownerOf(0)).to.equal(owner.address);
    expect(await crownKey.balanceOf(owner.address)).to.equal(1n);

    await crownKey.safeMint(other.address);
    expect(await crownKey.ownerOf(1)).to.equal(other.address);
    expect(await crownKey.balanceOf(owner.address)).to.equal(1n);
    expect(await crownKey.balanceOf(other.address)).to.equal(1n);
  });
});

