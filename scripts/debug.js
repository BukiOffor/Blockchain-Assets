
const{ethers, deployments} = require("hardhat")

async function main(){
    await deployments.fixture()
    // const accounts = await ethers.getSigners()
    // const deployer = accounts[0].address
    // const assets =  await ethers.getContract("Assets",deployer)
    //console.log( await assets.getAllAssets())
    
    
    const assets = await ethers.getContractAt("Assets","0x5FbDB2315678afecb367f032d93F642f64180aa3")
    const balance = (await ethers.provider.getBalance(assets.address)).toString()

    console.log(balance)   
    
}

  module.exports = main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
