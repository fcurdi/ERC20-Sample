require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ROPSTEN_URL = process.env.INFURA_ROPSTEN_URL;
const accounts = [
  process.env.METAMASK_PK_1,
  process.env.METAMASK_PK_2,
  process.env.METAMASK_PK_3,
  process.env.METAMASK_PK_4,
  process.env.METAMASK_PK_5,
  process.env.METAMASK_PK_6,
  process.env.METAMASK_PK_7,
];

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.10",
  networks: {
    ropsten: {
      url: ROPSTEN_URL,
      accounts,
    },
  },
};
