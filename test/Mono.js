const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mono token", () => {
  let contract,
    ownerAccount,
    secondAccount,
    thirdAccount,
    secondSigner,
    deploymentReceipt;
  const totalSupply = 1_000_000;

  beforeEach(async () => {
    const Mono = await ethers.getContractFactory("Mono");
    contract = await Mono.deploy();
    await contract.deployed();
    deploymentReceipt = contract.deployTransaction;
    [firstSigner, secondSigner, thirdSigner, _] = await ethers.getSigners();
    ownerAccount = firstSigner.address;
    secondAccount = secondSigner.address;
    thirdAccount = thirdSigner.address;
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
      await expect(deploymentReceipt)
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, ownerAccount, totalSupply);
    });
  });
  describe("Transfer", () => {
    it("Should revert with Insufficient funds when amount is greater than sender's balance", async () => {
      await expect(
        contract.transfer(secondAccount, totalSupply + 1)
      ).to.be.revertedWith("Insufficient funds");
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.balanceOf(secondAccount)).to.equal(0);
    });
    it("Should transfer correctly between two accounts", async () => {
      const amount = 1;
      const receipt = await contract.transfer(secondAccount, amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      expect(await contract.balanceOf(secondAccount)).to.equal(amount);
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, secondAccount, amount);
    });
  });
  describe("Approve", () => {
    it("Should approve allowance correctly", async () => {
      const amount = 100;
      const receipt = await contract.approve(secondAccount, amount);
      expect(await contract.balanceOf(secondAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
      expect(await contract.allowance(ownerAccount, secondAccount)).to.equal(
        amount
      );
      await expect(receipt)
        .to.emit(contract, "Approval")
        .withArgs(ownerAccount, secondAccount, amount);
    });
    it("Should approve allowance correctly multiple times", async () => {
      const amount1 = 100;
      const amount2 = 250;
      await contract.approve(secondAccount, amount1);
      await contract.approve(secondAccount, amount2);
      expect(await contract.allowance(ownerAccount, secondAccount)).to.equal(
        amount2
      );
      expect(await contract.balanceOf(secondAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
  });

  describe("TransferFrom", () => {
    it("Should not transfer when amount is greater than balance", async () => {
      await expect(
        contract.transferFrom(ownerAccount, secondAccount, totalSupply + 1)
      ).to.be.revertedWith("sender has not enough funds");
      expect(await contract.balanceOf(secondAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
    it("Should not transfer when there is no allowance", async () => {
      await expect(
        contract.transferFrom(ownerAccount, secondAccount, 1)
      ).to.be.revertedWith("not enough allowance");
      expect(await contract.balanceOf(secondAccount)).to.equal(0);
      expect(await contract.balanceOf(ownerAccount)).to.equal(totalSupply);
    });
    it("Should transfer correctly some allowance", async () => {
      const amount = 1;
      await contract.approve(secondAccount, amount * 2);
      const receipt = await contract
        .connect(secondSigner) // secondAccount
        .transferFrom(ownerAccount, thirdAccount, amount);
      expect(await contract.allowance(ownerAccount, secondAccount)).to.equal(
        amount
      );
      expect(await contract.balanceOf(thirdAccount)).to.equal(amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, thirdAccount, amount);
    });
    it("Should transfer correctly all allowance", async () => {
      const amount = 1;
      await contract.approve(secondAccount, amount);
      const receipt = await contract
        .connect(secondSigner) // secondAccount
        .transferFrom(ownerAccount, thirdAccount, amount);
      expect(await contract.allowance(ownerAccount, secondAccount)).to.equal(0);
      expect(await contract.balanceOf(thirdAccount)).to.equal(amount);
      expect(await contract.balanceOf(ownerAccount)).to.equal(
        totalSupply - amount
      );
      await expect(receipt)
        .to.emit(contract, "Transfer")
        .withArgs(ownerAccount, thirdAccount, amount);
    });
  });
});
