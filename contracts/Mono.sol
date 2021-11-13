//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Mono is IERC20 {
    address public creator;

    uint256 public override totalSupply = 1_000_000;

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) allowances;

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
        return allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        external
        override
        returns (bool)
    {
        address owner = msg.sender;
        require(
            balanceOf[owner] >= amount,
            "Not enough funds to approve allowance"
        );

        uint256 newAllowance = allowances[owner][spender] + amount;
        allowances[owner][spender] = newAllowance;
        emit Approval(owner, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(balanceOf[sender] >= amount, "sender has not enough funds");
        require(
            allowances[sender][recipient] >= amount,
            "not enough allowance"
        );

        allowances[sender][recipient] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
