const { assert, expect } = require("chai");
const {ethers,deployments,getNamedAccounts,} = require("hardhat");

describe("Assets", ()=>{
    //deploy our contract
    let assets, deployer,sendvalue,buyer,seller, accounts;
    beforeEach(async ()=>{
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners() // get primary keys
        buyer = accounts[1] //primary key
        seller = accounts[2]
        await deployments.fixture()
        assets = await ethers.getContract("Assets", deployer)
        sendvalue = ethers.utils.parseEther("10")
    })

    describe("getOwnership", ()=>{
        it("Should check that our ownership gets stored",async ()=>{
            receipt = await assets.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
            assert.equal(await assets.assetToAddressOwner(0), deployer)
            assert.equal(await assets.addressOwnerCount(deployer), 1)     
        })
    })
    describe("sellProperty",()=>{
        it("must have been approved by the contract owner", async ()=>{
            const receipt = await assets.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
            await expect(assets.sellProperty(0)).to.be.revertedWithCustomError(assets,"AssetNotApproved")
        })
        it("can only be called by the owner", async ()=>{
            const buyerAccount = await assets.connect(buyer)
            const sellerAccount = await assets.connect(seller)
            const receipt = await sellerAccount.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
            //deployer approving the asset
            await assets.ApproveAsset(0)
            await expect(buyerAccount.sellProperty(0)).to.be.revertedWithCustomError(buyerAccount,"NotOwner")
        })
    })
    describe("ApproveAsset",()=>{
        it("cannot be called by any address except the contract owner", async()=>{
            const sellerAccount = await assets.connect(seller)
            const receipt = await sellerAccount.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
            await expect( sellerAccount.ApproveAsset(0)).to.be.revertedWithCustomError(sellerAccount,"OnlyAdmin")
        })
        
        it("can only the called by the contract owner", async()=>{
            const sellerAccount = await assets.connect(seller)
            const receipt = await sellerAccount.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1) 
            await expect(assets.ApproveAsset(0)).not.to.be.reverted;
        })


    describe("buy",()=>{
        let sellerAccount,receipt,buyerAccount;
        beforeEach(async ()=>{
            buyerAccount = await assets.connect(buyer)
            sellerAccount = await assets.connect(seller)
            receipt = await sellerAccount.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
        })

        it("must be marked for sale",async ()=>{ 
            await expect(assets.buy(0,{value:sendvalue})).to.be.revertedWithCustomError(assets, "AssetNotForSale") 
        })

        it("buying amount must be greater or equal to value",async ()=>{
             await expect(assets.buy(0,{value:ethers.utils.parseEther("9")})).to.be.revertedWithCustomError(assets, "NotenoughToken") 
        })

        it("transaction should go through if everything is right",async ()=>{
            await assets.ApproveAsset(0)
            await sellerAccount.sellProperty(0)
            await expect(buyerAccount.buy(0,{value:sendvalue})).not.to.be.reverted
        })
        
        it("transaction should emit event",async ()=>{
            await assets.ApproveAsset(0)
            await sellerAccount.sellProperty(0)
            await expect(buyerAccount.buy(0,{value:sendvalue})).to.emit(assets,"soldAsset")
        })
        
    })
    describe("transferOwnership", ()=>{
        beforeEach(async()=>{
            const buyerAccount = await assets.connect(buyer)
            const sellerAccount = await assets.connect(seller)
            const receipt = await sellerAccount.getOwnership("Awka",110,3,sendvalue)
            receipt.wait(1)
            await assets.ApproveAsset(0)
            await sellerAccount.sellProperty(0)
            await buyerAccount.buy(0,{value:sendvalue})
        })
        it("sold asset should change ownership", async ()=>{
            const soldAsset = await assets.assets(0)
            assert.equal(soldAsset._address,buyer.address) 
        })
        it("sold asset sell status should automatically default to false", async()=>{
            const soldAsset = await assets.assets(0)
            assert.equal(soldAsset.sell,false)
        })
    })
    describe("retrieveOwnerAssets", ()=>{
        it("should return every asset that an address owns", async()=>{
            for (let i = 0; i<5; i++) {await assets.getOwnership("Awka",110,3,sendvalue)}
            const myAssets = await assets.retrieveOwnersAssets(deployer)
            //expect((myAssets).toString()).to.have.members(['0,1,2,3,4'])
            expect(myAssets).to.have.a.lengthOf(5)
        })
    })
})







})