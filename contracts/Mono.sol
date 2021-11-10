//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Mono is IERC20 {
    uint256 public override totalSupply = 1000000;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) allowances;

    error InsufficientFunds(uint256 balance, uint256 amountToTransfer);

    function transfer(address recipient, uint256 amount)
        external
        override
        returns (bool)
    {
        if (balanceOf[msg.sender] < amount) {
            revert InsufficientFunds(balanceOf[msg.sender], amount);
        }

        payable(recipient).transfer(amount);

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
            owner.balance < amount,
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
        require(sender.balance >= amount, "sender has not enough funds");
        require(
            allowances[sender][recipient] >= amount,
            "not enough allowance"
        );

        allowances[sender][recipient] -= amount;
        payable(recipient).transfer(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
