const MyNFT = artifacts.require("MyNFT");

module.exports = function(deployer, network, accounts) {
    const initialOwner = accounts[0];  // 첫 번째 계정을 소유자로 설정
    deployer.deploy(MyNFT, initialOwner);  // MyNFT에 initialOwner 전달
};
