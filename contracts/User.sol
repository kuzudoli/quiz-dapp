// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

struct User{
    address uWallet;
    uint uHintCount;//0->3
    uint uAnswerCount;//2->0
    bool isJoined;
}
