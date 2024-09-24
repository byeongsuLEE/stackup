pragma solidity ^0.8.7;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Storage.sol";

contract TestSimpleStroage {
    function testSimpleStroage() public {
            SimpleStorage ss = new SimpleStorage();

            uint expected = 4;
            ss.set(expected);
            Assert.equal(ss.get(), expected, "value equal test");
            
    }
}