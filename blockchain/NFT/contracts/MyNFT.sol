// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // ERC721 및 Ownable 생성자 호출
    constructor(address initialOwner) ERC721("MyNFT", "MNFT") Ownable(initialOwner) {
        // 이미 Ownable의 생성자에서 소유자 설정을 처리하므로 추가 설정은 필요 없음
    }

    // 소유자만 민팅 가능한 기능
    function mint(address recipient, string memory _tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    // 토큰이 존재하는지 확인하는 함수
    function tokenExists(uint256 tokenId) public view returns (bool) {
        // ownerOf 함수는 토큰이 존재하지 않으면 에러를 던지므로 이를 이용해 존재 여부를 확인
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
