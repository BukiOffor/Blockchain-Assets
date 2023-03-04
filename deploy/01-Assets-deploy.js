
const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hh-config")
const {verify} = require("../scripts/verify")


module.exports.default = async ({deployments}) => {
    const {deploy,log} = deployments
    const accounts = await ethers.getSigners()
    const deployer = accounts[0].address
    
    log("_____contract deploying________")
    const assets = await deploy("Assets", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("_____contract deployed________")
  

    if(!developmentChains.includes(network.name)) {
        log(`***********verifying ${assets.address}**********`)
        await verify(assets.address,[])
    }
}

module.exports.tags = ["Assets"]