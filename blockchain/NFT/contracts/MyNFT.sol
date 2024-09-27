// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // NFT 민팅 시 이벤트
    event Minted(address recipient, uint256 tokenId, string tokenURI);

    constructor() ERC721("MyNFT", "MNFT") {}

    // 소유자만 민팅 가능한 기능
    function mint(address recipient, string memory _tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        // 민팅 이벤트 발생
        emit Minted(recipient, tokenId, _tokenURI);
    }

    // 토큰이 존재하는지 확인하는 함수
    function tokenExists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }

    // 토큰 URI를 반환하는 함수
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenExists(tokenId), "Token does not exist.");
        return super.tokenURI(tokenId);
    }
}
