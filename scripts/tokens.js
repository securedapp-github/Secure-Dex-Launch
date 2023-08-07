const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Tether = await hre.ethers.getContractFactory("Tether");
  const tether = await Tether.deploy();

  await tether.deployed();

  console.log("Tether contract deployed to:", tether.address);

  const UsdCoin = await hre.ethers.getContractFactory("UsdCoin");
  const usdCoin = await UsdCoin.deploy();

  await usdCoin.deployed();

  console.log("UsdCoin contract deployed to:", usdCoin.address);

  // Mint some tokens for the deployer
  await tether.mint(deployer.address, hre.ethers.utils.parseEther("1000"));
  await usdCoin.mint(deployer.address, hre.ethers.utils.parseEther("1000"));

  console.log("Minted 1000 tokens for the deployer on each contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
