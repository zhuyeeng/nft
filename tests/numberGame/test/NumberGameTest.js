const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");

        

describe("NumberGame Contract", function(){
    async function deployToken(){
        const [owner,Player1, Player2,Player3] = await ethers.getSigners();
        const defaultMinBetRaw = ethers.utils.parseUnits('0.00005', 'ether');
        const defaultMinBet = defaultMinBetRaw.toNumber();
        const NumberGame = await ethers.getContractFactory("NumberGame");
        const hardhatContract = await NumberGame.deploy(defaultMinBet);
        
        await hardhatContract.deployed();

        return {hardhatContract,Player1,Player2,Player3,owner};
    };

    it("Target number can be read by owner only", async function(){
        const {hardhatContract,Player1} = await loadFixture(deployToken);
        await expect(hardhatContract.connect(Player1).getTargetNumber()).to.be.revertedWith("Only the owner can view the target number");
    });

    describe("Start Game", function(){

        it("Player should send more than 0.00005 ethers", async function(){
            const initialBet = ethers.utils.parseEther("0.00004");
            const {hardhatContract,Player1} = await loadFixture(deployToken);
            await expect(hardhatContract.connect(Player1).joinGame({value: initialBet})).to.be.revertedWith('Please send more ether to join the game');
        });

        it("Should allow 2 player to join the game", async function (){
            const initialBet = ethers.utils.parseEther("0.0001");
            const {hardhatContract, Player1,Player2,Player3} = await loadFixture(deployToken);
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await hardhatContract.connect(Player2).joinGame({value: initialBet});
            expect(await hardhatContract.player1()).to.equal(Player1.address);
            expect(await hardhatContract.player2()).to.equal(Player2.address);
            
            await expect(hardhatContract.connect(Player3).joinGame({value: initialBet})).to.be.revertedWith("Game is already full");
            //chcek the  contract balance equal to the total of both player initial bet.
            const contractAddress = hardhatContract.address;
            const contractBalance = await ethers.provider.getBalance(contractAddress);
            const balanceInEther = ethers.utils.formatEther(contractBalance);
            expect(await balanceInEther).to.equal("0.0002");

        });

        it("Owner should not join the game", async function() {
            const { hardhatContract, owner } = await loadFixture(deployToken);
            const initialBet = ethers.utils.parseEther("0.0001");
            // Use the owner signer directly, not the owner address
            await expect(hardhatContract.connect(owner).joinGame({ value: initialBet })).to.be.revertedWith('Owner cannot join the game');
        });

        it("Player should not rejoin the game", async function(){
            const {hardhatContract, Player1} = await loadFixture(deployToken);
            const initialBet = ethers.utils.parseEther("0.0001");
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await expect(hardhatContract.connect(Player1).joinGame({ value: initialBet })).to.be.revertedWith('you have already joined the game');
        });

        it("Player 2 bet must be the same as Player 1 initalBet", async function (){
            const initialBet = ethers.utils.parseEther("0.001");
            const initalBet2 = ethers.utils.parseEther("0.0001");
            const {hardhatContract, Player1,Player2} = await loadFixture(deployToken);
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await expect (hardhatContract.connect(Player2).joinGame({value: initalBet2})).to.be.revertedWith('The ether needed to join needs to be higher');
        });

    });

    describe("Guessing Time", function(){
        
        it("Player must guess between 1 to 10", async function(){
            const {hardhatContract,Player1} = await loadFixture(deployToken);

            const P1Guess = 12;
            const P2Guess = 0;
            await expect(hardhatContract.connect(Player1).finalizeGame(P1Guess, P2Guess)).to.be.revertedWith("Guess must be between 1 and 10");
        });

        it("Player bet must be higher than the minimum bet", async function(){
            const {hardhatContract,Player1,Player2} = await loadFixture(deployToken);
            const initalBet = ethers.utils.parseEther("0.0001");
            const BetValue = ethers.utils.parseEther("0.000001");
            const lowminbet = ethers.utils.parseEther("0.00006");
            await hardhatContract.connect(Player1).joinGame({value: initalBet});
            await hardhatContract.connect(Player2).joinGame({value: initalBet});
            
            await expect(hardhatContract.connect(Player1).makeGuess(3,{value: BetValue})).to.be.revertedWith("Please send more ether to join the game");
            await expect(hardhatContract.connect(Player2).makeGuess(4,{value: lowminbet})).to.be.revertedWith("Please send ether with your guess equal or higher than the entry fee");

        })

        it('If the game is draw, the players should split the balance', async () => {
            const{hardhatContract,Player1,Player2,owner} = await loadFixture(deployToken);
            const initalBet = ethers.utils.parseEther('0.01');
            const betValue = ethers.utils.parseEther('10');
            // Players join the game and make their guesses
            const p1Guess = 3;
            const p2Guess = 3;
            await hardhatContract.connect(owner).setTargetNumber(3);
            await hardhatContract.connect(Player1).joinGame({value: initalBet});
            await hardhatContract.connect(Player2).joinGame({value: initalBet});
            await hardhatContract.connect(Player1).makeGuess(p1Guess, {value: betValue, gasLimit: 100000});
            await hardhatContract.connect(Player2).makeGuess(p2Guess, {value: betValue, gasLimit: 120000});
            

            
            // Assert that the contract balance is now zero
            expect(await ethers.provider.getBalance(hardhatContract.address)).to.equal(0);
            const player1Balance = await Player1.getBalance();
            const player2Balance = await Player2.getBalance();
            // Convert player balances to BigNumber and perform arithmetic operations
            const player1Ether = ethers.BigNumber.from(player1Balance);
            const player2Ether = ethers.BigNumber.from(player2Balance);
            const oneEther = ethers.utils.parseEther('1');
            const P1DecimalEther = player1Ether.div(oneEther).toNumber();
            const P2DecimalEther = player2Ether.div(oneEther).toNumber();
            expect(P1DecimalEther).to.equal(9999);
            expect(P2DecimalEther).to.equal(9999);
            
            
        });

        it("if one player win, will get all the winnings", async function(){
            const{hardhatContract,owner,Player1,Player2} = await loadFixture(deployToken);
            const initalBet = ethers.utils.parseEther("0.0003");
            const BetValue = ethers.utils.parseEther("10");
            const P1Guess = 3;
            const P2Guess = 4;

            await hardhatContract.connect(owner).setTargetNumber(3);
            await hardhatContract.connect(Player1).joinGame({value: initalBet});
            await hardhatContract.connect(Player2).joinGame({value: initalBet});
            await hardhatContract.connect(Player1).makeGuess(P1Guess,{value: BetValue});
            await hardhatContract.connect(Player2).makeGuess(P2Guess,{value: BetValue});
            expect(await ethers.provider.getBalance(hardhatContract.address)).to.equal(0);
            const player1Balance = await Player1.getBalance();
            const player2Balance = await Player2.getBalance();

            // Convert player balances to BigNumber and perform arithmetic operations
            const player1Ether = ethers.BigNumber.from(player1Balance);
            const player2Ether = ethers.BigNumber.from(player2Balance);
            const oneEther = ethers.utils.parseEther('1');
            const P1DecimalEther = player1Ether.div(oneEther).toNumber();
            const P2DecimalEther = player2Ether.div(oneEther).toNumber();
            expect(P1DecimalEther).to.equal(10010);
            expect(P2DecimalEther).to.equal(9989);
        });

    });

    describe("Withdraw from Game", function(){
        it("if any player withdraw, half of their bet still in the contract", async function(){
            const {hardhatContract,Player1,Player2,owner} = await loadFixture(deployToken);
            const initialBet = ethers.utils.parseEther("0.0005");
            const BetValue = ethers.utils.parseEther("0.001");
            await hardhatContract.connect(owner).setTargetNumber(3);
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await hardhatContract.connect(Player2).joinGame({value: initialBet});
            await hardhatContract.connect(Player1).makeGuess(5,{value: BetValue});
            await hardhatContract.connect(Player2).makeGuess(6,{value: BetValue});
            await hardhatContract.connect(Player1).withdraw();
            const expectedbalance = ethers.utils.parseEther("0.00225");
            expect(await ethers.provider.getBalance(hardhatContract.address)).to.equal(expectedbalance);

        });

        it("Only allow the player who joined the game to withdraw", async function(){
                const {hardhatContract,Player1,Player2,Player3,owner} = await loadFixture(deployToken);
                const initialBet = ethers.utils.parseEther("0.0005");
            const BetValue = ethers.utils.parseEther("0.001");
            await hardhatContract.connect(owner).setTargetNumber(3);
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await hardhatContract.connect(Player2).joinGame({value: initialBet});
            await hardhatContract.connect(Player1).makeGuess(5,{value: BetValue});
            await hardhatContract.connect(Player2).makeGuess(6,{value: BetValue});
            await expect (hardhatContract.connect(Player3).withdraw()).to.be.revertedWith("Not a player");
        });

        it("Only allow the player to withdraw round 2 onwards and without starting the guessing yet.", async function(){
            const {hardhatContract,Player1,Player2,owner} = await loadFixture(deployToken);
            const initialBet = ethers.utils.parseEther("0.0005");
            const BetValue = ethers.utils.parseEther("0.001");
            await hardhatContract.connect(owner).setTargetNumber(3);
            await hardhatContract.connect(Player1).joinGame({value: initialBet});
            await hardhatContract.connect(Player2).joinGame({value: initialBet});
            await hardhatContract.connect(Player1).makeGuess(5,{value: BetValue});
            await hardhatContract.connect(Player2).makeGuess(6,{value: BetValue});
            await hardhatContract.connect(Player2).makeGuess(6,{value: BetValue});
            await expect (hardhatContract.connect(Player2).withdraw()).to.be.revertedWith("A guess is ongoing");
    });

    });
    
    
});