const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const Mono = await ethers.getContractFactory("Mono");
  const mono = Mono.attach("0x44320256B9e7ffB4Caac9bC89CA09FA7d25AedaB");
  const owner = "";
  const spender = "";
  return await mono.allowance(owner, spender);
}

main()
  .then((result) => {
    console.log(result.toString());
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
