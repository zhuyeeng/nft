const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("NumberGame", function () {

    let NumberGame;
    let numberGame;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        NumberGame = await ethers.getContractFactory("NumberGame");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        numberGame = await NumberGame.deploy(ethers.utils.parseEther("0.05"));

    });

    // describe("createGame", function () {
    //     it("should create a new game with the correct initial state", async function () {
    //         const createGameTx = await numberGame.createGame();

    //         const receipt = await createGameTx.wait();
    //         const gameId = receipt.events.filter(x => x.event == "GameCreated")[0].args.gameId;

    //         const game = await numberGame.games(gameId);

    //         expect(game.currentState).to.equal(0); // GameState.NewGame
    //         expect(game.player1).to.equal(ethers.constants.AddressZero);
    //         expect(game.player2).to.equal(ethers.constants.AddressZero);
    //         expect(game.minimumBet).to.equal(ethers.utils.parseEther("0.05"));
    //         expect(game.p1BetStatus).to.equal(false);
    //         expect(game.p2BetStatus).to.equal(false);
    //     });
    // });

    // describe("joinGame", function () {

    //     it("should not allow owner to join the game", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         console.log(gameId);
    //         await expect(
    //             numberGame.connect(owner).joinGame(gameId, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("Owner cannot join the game");
    //     });

    //     it("should not allow joining with less than minimum bet", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await expect(
    //             numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.01") })
    //         ).to.be.revertedWith("Please send more than default minimum bet to join the game");
    //     });

    //     it("should allow player1 to join and set the minimum bet", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         const game = await numberGame.games(gameId);
    //         expect(game.player1).to.equal(addr1.address);
    //         expect(game.minimumBet).to.equal(ethers.utils.parseEther("0.05"));
    //         expect(game.currentState).to.equal(1);  // GameState.WaitingForPlayer
    //     });

    //     it("should not allow player1 to join the game again", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await expect(
    //             numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("You have already joined the game");
    //     });

    //     it("should not allow player2 to join with mismatched bet", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.06") });
    //         await expect(
    //             numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("Insufficient bet, please match minimum bet");
    //     });

    //     it("should allow player2 to join and change the state to BothPlayersJoined", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         const game = await numberGame.games(gameId);
    //         expect(game.player2).to.equal(addr2.address);
    //         expect(game.currentState).to.equal(2);  // GameState.BothPlayersJoined
    //     });

    //     it("should not allow a third player to join", async function () {
    //         const tx = await numberGame.createGame();
    //         const receipt = await tx.wait();
    //         const gameId = receipt.events[0].args.gameId;
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await expect(
    //             numberGame.connect(addrs[0]).joinGame(gameId, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("game is either ended or full");
    //     });
    // });

    // describe("makeGuess and finalizeGame", function () {
    //     it("should allow players to make guesses, place bets, and automatically finalize the game", async function () {
    //         // Create a new game
    //         const gameTx = await numberGame.createGame();
    //         const gameId = (await gameTx.wait()).events[0].args.gameId;

    //         // Player 1 joins the game
    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

    //         // Player 2 joins the game
    //         await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

    //         // Make guesses and bets by players
    //         await numberGame.connect(addr1).makeGuess(gameId, 5, { value: ethers.utils.parseEther("0.05") });

    //         // Player 1 tries to bet again (should revert)
    //         await expect(
    //             numberGame.connect(addr1).makeGuess(gameId, 7, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("You have already bet");

    //         // Retrieve the updated game struct after Player 1's bet
    //         const gameAfterPlayer1Bet = await numberGame.games(gameId);

    //         // Check that bet status for Player 1 is true
    //         expect(gameAfterPlayer1Bet.p1BetStatus).to.be.true;
    //         expect(gameAfterPlayer1Bet.p2BetStatus).to.be.false;

    //         // Non-player tries to bet (should revert)
    //         await expect(
    //             numberGame.connect(addrs[0]).makeGuess(gameId, 3, { value: ethers.utils.parseEther("0.05") })
    //         ).to.be.revertedWith("only player 1 and player 2 can play");

    //         // Make guesses and bets by players
    //         await numberGame.connect(addr2).makeGuess(gameId, 7, { value: ethers.utils.parseEther("0.05") });

    //         // Retrieve the updated game struct after Player 2's bet
    //         const gameAfterPlayer2Bet = await numberGame.games(gameId);

    //         // Check that bet status for both players are false, game finalized has ran
    //         expect(gameAfterPlayer2Bet.p1BetStatus).to.be.false;
    //         expect(gameAfterPlayer2Bet.p2BetStatus).to.be.false;


    //         // Add more assertions based on the expected behavior of your contract
    //     });

    //     // Add more test cases to cover other scenarios
    //     it("should correctly distribute rewards to winner", async function () {
    //         const gameTx = await numberGame.createGame();
    //         const gameId = (await gameTx.wait()).events[0].args.gameId;

    //         const balanceBefore = await ethers.provider.getBalance(addr1.address);

    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

    //         // Let's assume target number is 5 (you may need to adjust this based on how you generate target numbers)
    //         await numberGame.connect(addr1).makeGuess(gameId, 1, { value: ethers.utils.parseEther("0.05") });
    //         await numberGame.connect(addr2).makeGuess(gameId, 2, { value: ethers.utils.parseEther("0.05") });

    //         const balanceAfter = await ethers.provider.getBalance(addr1.address);
    //         // deduct gas cost, please set the generateTargetNumber to nonrandom in contract to test this
    //         expect(balanceAfter.sub(balanceBefore)).to.be.gt(ethers.utils.parseEther("0.09"));
    //     });


    //     it("should revert when making an invalid guess", async function () {
    //         const gameTx = await numberGame.createGame();
    //         const gameId = (await gameTx.wait()).events[0].args.gameId;

    //         await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    //         await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

    //         await expect(numberGame.connect(addr1).makeGuess(gameId, 11, { value: ethers.utils.parseEther("0.05") }))
    //             .to.be.revertedWith("Guess must be between 1 and 10");
    //     });
    // });

    describe("withdraw", function () {
        let gameId;
        // it("should not allow non-players to withdraw", async function () {
        //     // Create a new game
        //     const createGameTx = await numberGame.createGame();
        //     const receipt = await createGameTx.wait();
        //     gameId = receipt.events.filter(x => x.event == "GameCreated")[0].args.gameId;
    
        //     await expect(numberGame.connect(owner).withdraw(gameId)).to.be.revertedWith("Not a player");
        // });
    
        // it("should not allow non-players to withdraw", async function () {
        //     await expect(numberGame.connect(addrs[0]).withdraw(gameId)).to.be.revertedWith("Not a player");
        // });
    
   
        // it("should allow a player to withdraw and set game state to GameEnded when conditions are met", async function () {
        //     await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
        //     let game = await numberGame.games(gameId);
        //     expect(game.currentState).to.equal(1); // GameState.WaitingForPlayer
        //     expect(game.player1).to.equal(addr1.address);
        //     expect(game.player1Bet).to.equal(ethers.utils.parseEther("0.05"));

        //     await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
        //     game = await numberGame.games(gameId);
        //     expect(game.currentState).to.equal(2); // GameState.BothPlayersJoined
        //     expect(game.player2).to.equal(addr2.address);
        //     expect(game.player2Bet).to.equal(ethers.utils.parseEther("0.05"));

        //     // Player 1 withdraws from the game
        //     await numberGame.connect(addr1).withdraw(gameId);

        //     // After withdrawal, the game state should be GameEnded and the balances of both players should be zero
        //     game = await numberGame.games(gameId);
        //     expect(game.currentState).to.equal(4); // GameState.GameEnded
        //     expect(game.player1Bet).to.equal(0);
        //     expect(game.player2Bet).to.equal(0);
        //     // addr1 tries to withdraw without moving the game to a valid state for withdrawal
        //     await expect(numberGame.connect(addr1).withdraw(gameId)).to.be.revertedWith("Game not in valid state");
        // });

        // it("should correctly transfer funds on withdrawal", async function () {
        //     const createGameTx = await numberGame.createGame();
        //     let receipt = await createGameTx.wait();
        //     gameId = receipt.events.filter(x => x.event == "GameCreated")[0].args.gameId;
        //     await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
        //     await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

        //     const initialContractBalance = await ethers.provider.getBalance(numberGame.address);
        //     const initialPlayerBalance = await ethers.provider.getBalance(addr1.address);   // less 0.05

        //     expect(initialContractBalance).to.equal(ethers.utils.parseEther("0.1"));
        //     // Player 1 withdraws from the game
        //     const tx = await numberGame.connect(addr1).withdraw(gameId);
        //     receipt = await tx.wait();
        //     const withdrawEvent = receipt.events.filter(e => e.event === 'Withdrawn')[0];
        //     console.log("Withdrawn Amount to Player 1:", withdrawEvent.args[2].toString());
        //     console.log("Withdrawn Amount to Player 2:", withdrawEvent.args[3].toString());

        //     const gasUsed = receipt.gasUsed.mul(tx.gasPrice);
        //     const expectedPlayerBalance = initialPlayerBalance.sub(gasUsed).add(ethers.utils.parseEther("0.025")); // Assuming half is refunded
        //     const finalPlayerBalance = await ethers.provider.getBalance(addr1.address);
        //     const x = finalPlayerBalance.sub(expectedPlayerBalance);

        //     expect(finalPlayerBalance).to.equal(expectedPlayerBalance);
        //     expect(await ethers.provider.getBalance(numberGame.address)).to.equal(initialContractBalance.sub(ethers.utils.parseEther("0.075"))); // Assuming total refund of 0.075 ether
        // });

        it("should handle non-existent gameId", async function () {
            const nonExistentGameId = 9999;
            await expect(numberGame.connect(addr1).withdraw(nonExistentGameId)).to.be.revertedWith("Game does not exist");
        });

        it("should resist reentrancy attacks", async function () {
            // Mock a reentrancy attempt by addr1
            await expect(numberGame.connect(addr1).withdraw(gameId)).to.be.revertedWith("ReentrancyGuard: reentrant call");
        });




    });
    
    // describe("NumberGame administrative functions", function () {
    //     let tx, receipt, gameId;
    //     describe("getTargetNumber", function () {
    //         it("should allow owner to get the target number", async function () {
    //             tx = await numberGame.createGame();
    //             receipt = await tx.wait();
    //             gameId = receipt.events[0].args.gameId;
    //             const targetNumber = await numberGame.getTargetNumber(gameId);
    //             expect(targetNumber).to.be.at.least(1);
    //             expect(targetNumber).to.be.at.most(10);  // If 10 is your maximum target number
    //         });

    //         it("should not allow non-owner to get the target number", async function () {
    //             // Use a non-owner address (like addr1)
    //             await expect(numberGame.connect(addr1).getTargetNumber(gameId)).to.be.revertedWith("Not authorized");
    //         });
    //     });

    //     describe("setNextGameId", function () {

    //         const GameState = {
    //             NewGame: 0,
    //             WaitingForPlayer: 1,
    //             BothPlayersJoined: 2,
    //             AwaitingNewBets: 3,
    //             GameEnded: 4
    //         };
    //         // Testing boundary conditions
    //         it("should successfully create a game and increment nextGameId", async function () {
    //             await numberGame.createGame();
    //             const currentNextGameId = await numberGame.nextGameId();
    //             await numberGame.setNextGameId(currentNextGameId.sub(1));
    //             const updatedNextGameId = await numberGame.nextGameId();
    //             expect(updatedNextGameId).to.equal(currentNextGameId.sub(1));
    //         });

    //         it("should revert if trying to set next game ID to the current value", async function () {
    //             const currentNextGameId = await numberGame.nextGameId();
    //             await expect(numberGame.setNextGameId(currentNextGameId)).to.be.revertedWith("Invalid game ID");
    //         });

    //         it("should revert if trying to set next game ID to zero", async function () {
    //             await expect(numberGame.setNextGameId(0)).to.be.revertedWith("Invalid game ID");
    //         });

    //         // Testing behavior in a series of operations
    //         it("should correctly create a game after consecutive calls to setNextGameId", async function () {
    //             await numberGame.createGame();
    //             await numberGame.createGame();
    //             const originalNextGameId = await numberGame.nextGameId(); //3
    //             // Lower the nextGameId
    //             await numberGame.setNextGameId(originalNextGameId.sub(2)); // 1

    //             tx = await numberGame.createGame();
    //             receipt = await tx.wait();
    //             const newGameId = receipt.events[0].args.gameId;  //1
    //             // Check if the game has the ID we expect (which is now originalNextGameId - 2)
    //             expect(newGameId).to.equal(originalNextGameId.sub(2));  // 1

    //             const gameAfterCreation = await numberGame.games(newGameId);    //3
    //             expect(gameAfterCreation.currentState).to.equal(GameState.NewGame);
    //         });

    //         it("should increment nextGameId after game creation", async function () {
    //             const originalNextGameId = await numberGame.nextGameId();

    //             await numberGame.createGame();

    //             const incrementedNextGameId = await numberGame.nextGameId();
    //             expect(incrementedNextGameId).to.equal(originalNextGameId.add(1));
    //         });

    //         // Check game creation with no interference to nextGameId
    //         it("should create a game and set its properties correctly", async function () {
    //             tx = await numberGame.createGame();
    //             receipt = await tx.wait();
    //             gameId = receipt.events[0].args.gameId;

    //             const gameAfterCreation = await numberGame.games(gameId);
    //             expect(gameAfterCreation.currentState).to.equal(GameState.NewGame);
    //             expect(gameAfterCreation.player1).to.equal(ethers.constants.AddressZero);
    //             expect(gameAfterCreation.player2).to.equal(ethers.constants.AddressZero);
    //             expect(gameAfterCreation.p1BetStatus).to.be.false;
    //             expect(gameAfterCreation.p2BetStatus).to.be.false;

    //             const targetNumber = await numberGame.getTargetNumber(gameId);
    //             expect(targetNumber).to.be.within(1, 10);  // Assuming your `generateTargetNumber` function generates a number between 1 to 10 inclusive
    //         });
    //     });
    // });


});
