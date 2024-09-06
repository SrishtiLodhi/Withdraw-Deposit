// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DepositWithdraw {
    IERC20 public tokenAddress;
    IERC20 public ethToken; // ETH ERC20 token
    address public admin;
    uint256 public price = 10;

    constructor(
        address _admin,
        address _tokenAddress,
        address _ethTokenAddress
    ) {
        require(_admin != address(0), "admin is the zero address");
        require(_tokenAddress != address(0), "tokenAddress is the zero address");
        require(_ethTokenAddress != address(0), "ethTokenAddress is the zero address");
        tokenAddress = IERC20(_tokenAddress);
        ethToken = IERC20(_ethTokenAddress);
        admin = _admin;
    }

    event Deposit(address indexed account, uint256 tokenAmount, uint256 ethAmount);
    event Withdrawal(address indexed account, uint256 tokenAmount, uint256 ethAmount);

    function deposit(uint256 tokenAmount) public {
        require(tokenAddress.balanceOf(msg.sender) >= tokenAmount, "Deposit amount must be less than or equal to user balance");
        require(tokenAmount > 0, "Deposit amount must be greater than 0");
        require(tokenAddress.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");
        uint256 ethAmount = tokenAmount / price;
        require(ethToken.transfer(msg.sender, ethAmount), "ETH token transfer failed");
        emit Deposit(msg.sender, tokenAmount, ethAmount);
    }

    function withdraw(uint256 ethAmount) public {
        require(ethAmount > 0, "Withdrawal amount must be greater than 0");
        uint256 tokenAmount = ethAmount * price;
        require(tokenAddress.balanceOf(address(this)) >= tokenAmount, "Insufficient balance");
        require(ethToken.transferFrom(msg.sender, address(this), ethAmount), "ETH token transfer failed");
        require(tokenAddress.transfer(msg.sender, tokenAmount), "Token transfer failed");
        emit Withdrawal(msg.sender, tokenAmount, ethAmount);
    }

    function withdrawAdmin(uint256 amount) public {
        require(msg.sender == admin, "only admin can withdraw");
        require(ethToken.transfer(msg.sender, amount), "ETH token transfer failed");
    }
}