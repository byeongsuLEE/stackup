// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol"; // 소유자 관리

contract SSFToken is ERC721, Ownable {
    uint256 private _tokenIdCounter = 1; // 토큰 ID 카운터
    mapping(uint256 => string) private _tokenURIs; // 토큰 URI 저장

constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

// 민팅 함수
function mint(string memory tokenURI_) public onlyOwner {
    uint256 tokenId = _tokenIdCounter;
    _mint(msg.sender, tokenId); // NFT 발행 
    _setTokenURI(tokenId, tokenURI_); // URI 설정
    _tokenIdCounter++; // 토큰 ID 증가
    emit Minted(msg.sender, tokenId);
}

// 토큰 URI 조회 함수
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return _tokenURIs[tokenId];
}

// 내부 함수: 토큰 URI 설정
function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    _tokenURIs[tokenId] = _tokenURI;
}

// 민팅 이벤트
event Minted(address indexed owner, uint256 indexed tokenId);
}