// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrownKey is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    uint256 public immutable supplyCap;

    constructor(string memory baseURI_, uint256 supplyCap_) ERC721("CrownKey", "CRNKY") {
        _baseTokenURI = baseURI_;
        supplyCap = supplyCap_;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _baseTokenURI = baseURI_;
    }

    function safeMint(address to) public onlyOwner {
        require(_nextTokenId < supplyCap, "Max supply reached");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
