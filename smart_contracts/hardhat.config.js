// https://eth-sepolia.g.alchemy.com/v2/DkNBOvnIVPSEJqC7EBRhrrhOMO8I1K4G

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/DkNBOvnIVPSEJqC7EBRhrrhOMO8I1K4G',
      accounts: ['7142bf9332ac9541ed811bcdfd72e2e777398344b259853d1e5eced31d518b02']
    }
  }
}