const networkConfig = {
    5 : {
        name: "goerli",
        ethUsdPrice: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    1 : {
        name : "etherum",
        ethUsdPrice : "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    }
}

const developmentChains = ["hardhat", "localhost"]


module.exports = {
    developmentChains,
    networkConfig,
  
}