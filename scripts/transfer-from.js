const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const Mono = await ethers.getContractFactory("Mono");
  const mono = Mono.attach("0x44320256B9e7ffB4Caac9bC89CA09FA7d25AedaB");
  const from = "";
  const sender = "";
  const recipient = "";
  const amount = 5;
  const fromSigner = (await ethers.getSigners()).find(
    (signer) => signer.address === from
  );

  return await mono.connect(fromSigner).transferFrom(sender, recipient, amount);
}

// 699.89
main()
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
