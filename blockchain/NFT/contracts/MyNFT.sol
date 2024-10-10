// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 public nextTokenId;

    // NFT 민팅 시 이벤트
    event Minted(address recipient, uint256 tokenId, string tokenURI);

    constructor() ERC721("MyNFT", "MNFT") {}

    // 누구나 민팅 가능한 기능으로 수정
    function mint(address recipient, string memory _tokenURI) external {
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
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(tokenExists(tokenId), "Token does not exist.");
        return super.tokenURI(tokenId);
    }

    // ERC721Enumerable과 ERC721URIStorage의 supportsInterface를 오버라이드
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // 두 개의 부모 계약에서 정의된 _beforeTokenTransfer를 오버라이드합니다.
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    // 두 개의 부모 계약에서 정의된 _burn을 오버라이드합니다.
    function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }
}
