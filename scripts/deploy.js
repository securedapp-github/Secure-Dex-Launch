const WETH9 = require('../WETH9.json');

const factoryArtifacts = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const routerArtifacts = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const pairArtifacts = require('@uniswap/v2-core/build/UniswapV2Pair.json');
const { ContractFactory, utils, Contract, constants} = require('ethers');

async function main() {
  const [owner] = await ethers.getSigners();

  const Factory = new ContractFactory(factoryArtifacts.abi, factoryArtifacts.bytecode, owner);
  const factory = await Factory.deploy(owner.address);
  // await factory.deployed();
  console.log('Factory deployed to:', factory.address);

  const Usdt = await ethers.getContractFactory('Tether', owner);
  const usdt = await Usdt.deploy();
  console.log('USDT deployed to:', usdt.address);

  const Usdc = await ethers.getContractFactory('UsdCoin', owner);
  const usdc = await Usdc.deploy();
  console.log('USDC deployed to:', usdc.address);

  await usdt.connect(owner).mint(
    owner.address, 
    utils.parseEther('100000')
  );

  await usdc.connect(owner).mint(
    owner.address,
    utils.parseEther('100000')
  );

  const tx1 = await factory.createPair(usdt.address, usdc.address);
  tx1.wait();

  const pairAddress = await factory.getPair(usdt.address, usdc.address);
  console.log('Pair address:', pairAddress);

  const pair = new Contract(pairAddress, pairArtifacts.abi, owner);
  let reserves
  reserves = await pair.getReserves();
  console.log('Reserves:', reserves);

  const Weth = new ContractFactory(WETH9.abi, WETH9.bytecode, owner);
  const weth = await Weth.deploy();
  console.log('WETH deployed to:', weth.address);

  const Router = new ContractFactory(routerArtifacts.abi, routerArtifacts.bytecode, owner);
  const router = await Router.deploy(factory.address, weth.address);
  console.log('Router deployed to:', router.address);

  const approval1 = await usdt.connect(owner).approve(router.address, constants.MaxUint256);
  approval1.wait();
  const approval2 = await usdc.connect(owner).approve(router.address, constants.MaxUint256);
  approval2.wait();

  const token0Amount = utils.parseUnits('100');
  const token1Amount = utils.parseUnits('100');

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from the current Unix time

  const addLiquidityTx = await router.connect(owner).addLiquidity(
    usdt.address,
    usdc.address,
    token0Amount,
    token1Amount,
    0,
    0,
    owner.address,
    deadline,
    {gasLimit: utils.hexlify(1000000)}
  );
  addLiquidityTx.wait();

  reserves = await pair.getReserves();
  console.log('Reserves:', reserves);

  const liquidity = await pair.balanceOf(owner.address);
  
  await pair.approve(router.address, liquidity);
  
  const rLP = await router.removeLiquidity(
    usdt.address,
    usdc.address,
    liquidity,
    0,
    0,
    owner.address,
    deadline
  );
  await rLP.wait();
  
  reserves = await pair.getReserves();
  console.log('Reserves:', reserves);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }
);
