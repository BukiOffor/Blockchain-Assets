
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
        waitConfirmations: network.config.blockConifrmations || 1,
    })
    log("_____contract deployed________")
    log(`***********verifying ${assets.address}**********`)

    if(!developmentChains.includes(network.name)) {
        await verify(assets.address,[])
    }
}