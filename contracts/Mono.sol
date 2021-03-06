//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Mono is IERC20, IERC20Metadata {
    address public creator;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) private _allowance;

    constructor() {
        creator = msg.sender;
        _name = "Mono";
        _symbol = "MON";
        _decimals = 2;
        _totalSupply = 1000 * (10**uint256(_decimals));
        mint();
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balanceOf[account];
    }

    function allowance(address owner, address spender)
        external
        view
        returns (uint256)
    {
        return _allowance[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        return _transfer(msg.sender, recipient, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        require(
            _allowance[sender][msg.sender] >= amount,
            "Not enough allowance"
        );
        _allowance[sender][msg.sender] -= amount;
        return _transfer(sender, recipient, amount);
    }

    function mint() private {
        _balanceOf[creator] = _totalSupply;
        emit Transfer(address(0x0), creator, _totalSupply);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private returns (bool) {
        require(_balanceOf[sender] >= amount, "Insufficient funds");
        _balanceOf[sender] -= amount;
        _balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
