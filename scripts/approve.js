const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const Mono = await ethers.getContractFactory("Mono");
  const mono = Mono.attach("0x44320256B9e7ffB4Caac9bC89CA09FA7d25AedaB");
  const from = "";
  const spender = "";
  const amount = 10;
  const fromSigner = (await ethers.getSigners()).find(
    (signer) => signer.address === from
  );
  return await mono.connect(fromSigner).approve(spender, amount);
}

main()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
