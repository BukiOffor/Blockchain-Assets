// SPDX-License-Identifier: MIT

//This Script might not be just for lands or assets it might be things that have value and can be backed with a physical property
//implement a loan system where can borrow and put there assests as a collatarel 
pragma solidity ^0.8.17;

error NotOwner();
error NotenoughToken();
error AssetNotForSale();
error OnlyAdmin();
error AssetNotApproved();

contract Assets {
    Deeds[] public assets;
    mapping(address=>Deeds) public ownersToDeeds;
    mapping(address=>uint)public addressOwnerCount;
    mapping(uint => address)public assetToAddressOwner;
    
    event soldAsset(address formerOwner, uint assetId, address newOwner, uint time);
    
    address owner;
    
    constructor(){
        owner = msg.sender;
    }

    struct Deeds {
        address payable _address;
        string location;
        uint geo_location;
        uint plot;
        uint value;
        uint time;
        bool sell;
        bool approved;
    }
    modifier onlyOwner() {
        if(msg.sender != owner) revert OnlyAdmin();
        _;
    }
   
     
     
    //Make Sure that the amount is sufficient an dthe asset is for sale 
    modifier validator(uint _id){
        if(msg.value < assets[_id].value) revert NotenoughToken();
        if(assets[_id].sell != true) revert AssetNotForSale();
        _;
        //require(msg.value >= assets[_id].value, "Insuficient amount to obtain asset");
        //require(assets[_id].sell == true, "Asset is not for sale");
        // require(msg.sender == owner);
        //if (msg.sender != assets[_id]._address) revert NotOwner(); 
    }
    //This function creates ownership of an asset
    // might only be called by the onlyOwner modifier in future
    function getOwnership(string memory location, uint geo_location,uint plot, uint value) public{
        Deeds memory _deed = Deeds( payable(msg.sender),location, geo_location,plot,value,block.timestamp,false,false);
        assets.push(_deed);
        ownersToDeeds[msg.sender] = _deed;
        addressOwnerCount[msg.sender]++; 
        assetToAddressOwner[assets.length-1] = msg.sender;
    }

    //mark asset as sellable
    function sellProperty(uint _id) public {
        if(assets[_id].approved == false) {revert AssetNotApproved();}
        if (msg.sender != assets[_id]._address) {revert NotOwner();}
        assets[_id].sell = true;
    }

    //This function approves the asset that is being entered, that it is legitimate ans true
    function ApproveAsset(uint _id)public onlyOwner{
        assets[_id].approved = true;
    }

    // this function exchanges an asset for its current value
    function buy(uint _id) public payable validator(_id){
        address _address = assets[_id]._address;
        (bool sent,) =_address.call{value: msg.value}("");
        require(sent);
        assets[_id].value = msg.value; 
        transferOwnership(_id);
        emit soldAsset(_address,_id,msg.sender,block.timestamp);
    }
    //Transfers ownership of an asset and updates mappings and variables
    function transferOwnership(uint _id) private { 
        address _address = assets[_id]._address;
        addressOwnerCount[_address]--; 
        assets[_id]._address = payable(msg.sender);
        addressOwnerCount[msg.sender]++;
        assetToAddressOwner[_id] = msg.sender;
        ownersToDeeds[msg.sender] = assets[_id];
        assets[_id].sell = false;
        
    }
    

    function getAllAssets() public view returns(Deeds[] memory){
        return assets;
    }
    function getmyAsset(uint _id)public view returns(Deeds memory){
        return assets[_id];
    }

    //this function retreives owners assets
    function retrieveOwnersAssets(address _address)public view returns(uint[] memory){
        uint[] memory array =  new uint[](addressOwnerCount[_address]);
        uint counter = 0;
        for (uint i = 0; i < assets.length; i++) 
        {
            if(assetToAddressOwner[i] == _address){
               array[counter] = i;
                counter++;
            }
        } return array;
    }
    
    //create a function that updates the value of an asset
    function updateValue(uint _id)public{}

    function inheritOwnership() public{}
    function partOwnership()public{}
    function giftOwnership()public{}
}
