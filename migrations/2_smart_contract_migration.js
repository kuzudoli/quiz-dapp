const NugzNFTs = artifacts.require("NugzNFTs");

module.exports = function (deployer) {
  deployer.deploy(NugzNFTs);
};
