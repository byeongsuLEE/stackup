const SSFToken = artifacts.require("SSFToken");

module.exports = function (deployer) {
    const name = "MyNFT"; // NFT 이름
    const symbol = "MNFT"; // NFT 심볼
    deployer.deploy(SSFToken, name, symbol);
};
