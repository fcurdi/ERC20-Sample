const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mono token", () => {
  let contract, ownerAccount, otherAccount;

  beforeEach(async () => {
    const Mono = await ethers.getContractFactory("Mono");
    contract = await Mono.deploy();
    await contract.deployed();
    [firstSigner, secondSigner, _] = await ethers.getSigners();
    ownerAccount = firstSigner.address;
    otherAccount = secondSigner.address;
  });

  describe("Deployment", () => {
    it("Should assing owner with the total supply of tokens", async () => {
      expect(await contract.creator()).to.equal(ownerAccount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        await contract.totalSupply()
      );
    });
  });
  describe("Transfer", () => {
    it("Should revert with Insufficient funds when amount is greater than sender's balance", async () => {
      const totalSupply = await contract.totalSupply();
      await expect(
        contract.transfer(otherAccount, totalSupply + 1)
      ).to.be.revertedWith("Insufficient funds");
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
    });
    it("Should transfer correctly between two accounts", async () => {
      const amount = 1;
      const totalSupply = await contract.totalSupply();
      const receipt = await contract.transfer(otherAccount, amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      expect(await contract.balanceOf(otherAccount)).to.equal(amount);
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, otherAccount, amount);
    });
  });
  describe("TransferFrom", () => {
    // TODO
  });
});
