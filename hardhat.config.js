require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ROPSTEN_URL = process.env.INFURA_ROPSTEN_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: ROPSTEN_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
