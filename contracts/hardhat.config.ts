import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  mocha: {
    timeout: 120000
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
  localhost: {
    type: "http",
    chainType: "l1",
    url: "http://127.0.0.1:8545",
  },

  hardhatMainnet: {
    type: "edr-simulated",
    chainType: "l1",
  },

  hardhatOp: {
    type: "edr-simulated",
    chainType: "op",
  },

  sepolia: {
    type: "http",
    chainType: "l1",
    url: configVariable("SEPOLIA_RPC_URL"),
    accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
  },
},
});
