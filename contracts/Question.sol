// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

struct Question{
    string qDesc;
    uint qPrize;//must be wei
    uint qDate;
    string[3] qHints;
    string qAnswer;
    bool qState;
    bool qWait;
}