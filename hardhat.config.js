require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    }
  },
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/XEL7Bu2in_J0nt2Lnpd3TW4O8TG7GLdj",
      accounts: ["24d22ddbd5ee6c95e67cb20f94ee356a90bd1b1cdaf5b4d1025f055bd14ae566"]
    }
  }
};
