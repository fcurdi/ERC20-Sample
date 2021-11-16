//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Mono is IERC20, IERC20Metadata {
    address public creator;

    string public override name = "Mono";

    string public override symbol = "MON";

    uint8 public override decimals = 18;

    uint256 public override totalSupply = 1_000_000;

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) _allowances;

    constructor() {
        creator = msg.sender;
        balanceOf[creator] = totalSupply;
    }

    function transfer(address recipient, uint256 amount)
        external
        override
        returns (bool)
    {
        require(balanceOf[msg.sender] >= amount, "Insufficient funds");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        external
        override
        returns (bool)
    {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(balanceOf[sender] >= amount, "sender has not enough funds");
        require(
            _allowances[sender][msg.sender] >= amount,
            "not enough allowance"
        );
        _allowances[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
