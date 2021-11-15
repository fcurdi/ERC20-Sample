const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mono token", () => {
  let contract, ownerAccount, otherAccount;
  const totalSupply = 1_000_000;

  beforeEach(async () => {
    const Mono = await ethers.getContractFactory("Mono");
    contract = await Mono.deploy();
    await contract.deployed();
    [firstSigner, secondSigner, _] = await ethers.getSigners();
    ownerAccount = firstSigner.address;
    otherAccount = secondSigner.address;
  });

  describe("Deployment", () => {
    it("Should configure correctly name, symbol, decimals and total supply of tokens", async () => {
      expect(await contract.name()).to.equal("Mono");
      expect(await contract.symbol()).to.equal("MON");
      expect(await contract.decimals()).to.equal(18);
      expect(await contract.totalSupply()).to.equal(totalSupply);
    });
    it("Should assing owner with the total supply of tokens", async () => {
      expect(await contract.creator()).to.equal(ownerAccount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
  });
  describe("Transfer", () => {
    it("Should revert with Insufficient funds when amount is greater than sender's balance", async () => {
      await expect(
        contract.transfer(otherAccount, totalSupply + 1)
      ).to.be.revertedWith("Insufficient funds");
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
    });
    it("Should transfer correctly between two accounts", async () => {
      const amount = 1;
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
  describe("Approve", () => {
    it("Should not approve allowance when amount is greater than balance", async () => {
      await expect(
        contract.approve(otherAccount, totalSupply + 1)
      ).to.be.revertedWith("Not enough funds to approve allowance");
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.allowance(ownerAccount, otherAccount)).to.equal(0);
    });

    it("Should approve allowance correctly", async () => {
      const amount = 100;
      const receipt = await contract.approve(otherAccount, amount);
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.allowance(ownerAccount, otherAccount)).to.equal(
        amount
      );
      await expect(receipt)
        .to.emit(contract, "Approval")
        .withArgs(ownerAccount, otherAccount, amount);
    });
    it("Should approve allowance correctly multiple times", async () => {
      const amount1 = 100;
      const amount2 = 250;
      await contract.approve(otherAccount, amount1);
      await contract.approve(otherAccount, amount2);
      expect(await contract.allowance(ownerAccount, otherAccount)).to.equal(
        amount1 + amount2
      );
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
  });

  describe("TransferFrom", () => {
    it("Should not transfer when amount is greater than balance", async () => {
      await expect(
        contract.transferFrom(ownerAccount, otherAccount, totalSupply + 1)
      ).to.be.revertedWith("sender has not enough funds");
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
    it("Should not transfer when there is no allowance", async () => {
      await expect(
        contract.transferFrom(ownerAccount, otherAccount, 1)
      ).to.be.revertedWith("not enough allowance");
      expect(await contract.balanceOf(otherAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
    it("Should transfer correctly some allowance", async () => {
      const amount = 1;
      await contract.approve(otherAccount, amount * 2);
      const receipt = await contract.transferFrom(
        ownerAccount,
        otherAccount,
        amount
      );
      expect(await contract.allowance(ownerAccount, otherAccount)).to.equal(
        amount
      );
      expect(await contract.balanceOf(otherAccount)).to.equal(amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, otherAccount, amount);
    });
    it("Should transfer correctly all allowance", async () => {
      const amount = 1;
      await contract.approve(otherAccount, amount);
      const receipt = await contract.transferFrom(
        ownerAccount,
        otherAccount,
        amount
      );
      expect(await contract.allowance(ownerAccount, otherAccount)).to.equal(0);
      expect(await contract.balanceOf(otherAccount)).to.equal(amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, otherAccount, amount);
    });
  });
});
