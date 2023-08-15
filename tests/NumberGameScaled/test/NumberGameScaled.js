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

    describe("makeGuess and finalizeGame", function () {
        it("should allow players to make guesses, place bets, and automatically finalize the game", async function () {
            // Create a new game
            const gameTx = await numberGame.createGame();
            const gameId = (await gameTx.wait()).events[0].args.gameId;

            // Player 1 joins the game
            await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

            // Player 2 joins the game
            await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

            // Make guesses and bets by players
            await numberGame.connect(addr1).makeGuess(gameId, 5, { value: ethers.utils.parseEther("0.05") });

            // Player 1 tries to bet again (should revert)
            await expect(
                numberGame.connect(addr1).makeGuess(gameId, 7, { value: ethers.utils.parseEther("0.05") })
            ).to.be.revertedWith("You have already bet");

            // Retrieve the updated game struct after Player 1's bet
            const gameAfterPlayer1Bet = await numberGame.games(gameId);

            // Check that bet status for Player 1 is true
            expect(gameAfterPlayer1Bet.p1BetStatus).to.be.true;
            expect(gameAfterPlayer1Bet.p2BetStatus).to.be.false;

            // Non-player tries to bet (should revert)
            await expect(
                numberGame.connect(addrs[0]).makeGuess(gameId, 3, { value: ethers.utils.parseEther("0.05") })
            ).to.be.revertedWith("only player 1 and player 2 can play");

            // Make guesses and bets by players
            await numberGame.connect(addr2).makeGuess(gameId, 7, { value: ethers.utils.parseEther("0.05") });

            // Retrieve the updated game struct after Player 2's bet
            const gameAfterPlayer2Bet = await numberGame.games(gameId);

            // Check that bet status for both players are false, game finalized has ran
            expect(gameAfterPlayer2Bet.p1BetStatus).to.be.false;
            expect(gameAfterPlayer2Bet.p2BetStatus).to.be.false;


            // Add more assertions based on the expected behavior of your contract
        });

        // Add more test cases to cover other scenarios
        it("should correctly distribute rewards to winner", async function () {
            const gameTx = await numberGame.createGame();
            const gameId = (await gameTx.wait()).events[0].args.gameId;

            const balanceBefore = await ethers.provider.getBalance(addr1.address);

            await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
            await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
    
            // Let's assume target number is 5 (you may need to adjust this based on how you generate target numbers)
            await numberGame.connect(addr1).makeGuess(gameId, 1, { value: ethers.utils.parseEther("0.05") });
            await numberGame.connect(addr2).makeGuess(gameId, 2, { value: ethers.utils.parseEther("0.05") });
    
            const balanceAfter = await ethers.provider.getBalance(addr1.address);
            // deduct gas cost
        expect(balanceAfter.sub(balanceBefore)).to.be.gt(ethers.utils.parseEther("0.09"));
        });

        
    it("should revert when making an invalid guess", async function () {
        const gameTx = await numberGame.createGame();
        const gameId = (await gameTx.wait()).events[0].args.gameId;

        await numberGame.connect(addr1).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });
        await numberGame.connect(addr2).joinGame(gameId, { value: ethers.utils.parseEther("0.05") });

        await expect(numberGame.connect(addr1).makeGuess(gameId, 11, { value: ethers.utils.parseEther("0.05") }))
            .to.be.revertedWith("Guess must be between 1 and 10");
    });
    });

});
