pragma solidity ^0.8.7;
contract SimpleStorage {
  uint val;

  function set(uint x) public {
    val = x;
  }

  function get() public view returns (uint) {
    return val;
}
}