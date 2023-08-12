import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


pragma solidity ^ 0.8.0;

contract NumberGame is ReentrancyGuard {
    enum GameState {
        NewGame,
        WaitingForPlayer,
        BothPlayersJoined,
        BothPlayerFinishBet,
        AwaitingNewBets,
        GameEnded
    }

    struct Game {
        GameState currentState;
        address payable player1;
        address payable player2;
        uint256 player1Bet;
        uint256 player2Bet;
        uint256 targetNumber;
        uint256 minimumBet;
        uint256 player1Guess;
        uint256 player2Guess;
        bool p1BetStatus;
        bool p2BetStatus;
    }

    address payable public owner;
    uint256 public defaultMinBet;
    int256 public unclaimedBalance;


    // gameId -> Game mapping
    mapping(uint256 => Game) public games;

    // Tracks the next game ID
    uint256 public nextGameId = 1;

    constructor(uint256 _defaultMinBet) payable {
        owner = payable(msg.sender);
        defaultMinBet = _defaultMinBet;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this");
        _;
    }


    function createGame() public returns(uint256) {
    uint256 gameId = nextGameId++;  // Reserve the current ID and then increment it for the next game.

        games[gameId] = Game({
            currentState: GameState.NewGame,
            player1: payable(address(0)),
            player2: payable(address(0)),
            player1Bet: 0,
            player2Bet: 0,
            targetNumber: generateTargetNumber(),
            minimumBet: defaultMinBet,  // Added minimumBet initialization
            player1Guess: 0,
            player2Guess: 0,
            p1BetStatus: false,
            p2BetStatus: false
        });
        return gameId;
    }


    function joinGame(uint256 gameId) public payable {
        Game storage game = games[gameId];

        require(game.currentState == GameState.NewGame ||
            game.currentState == GameState.WaitingForPlayer,
            "game is either ended or full"
        );

        require(game.player1 == address(0) || game.player2 == address(0),
            "Game is already full"
        );
        require(msg.sender != game.player1, "You have already joined the game");
        require(msg.sender != owner, "Owner cannot join the game");
        require(msg.value >= defaultMinBet,
            "Please send more than default minimum bet to join the game"
        );

        if (game.player1 == address(0)) {
            game.player1 = payable(msg.sender);
            game.minimumBet = msg.value;
            game.player1Bet += msg.value;
            game.currentState = GameState.WaitingForPlayer;
        } else if (game.player2 == address(0)) {
            require(msg.value == game.minimumBet,
                "Insufficient bet, please match minimum bet");
            game.player2 = payable(msg.sender);
            game.player2Bet += msg.value;
            game.currentState = GameState.BothPlayersJoined;
        }
    }

    function makeGuess(uint256 gameId, uint256 guessNumber) public payable {
        Game storage game = games[gameId];

        require(msg.sender == game.player1 || msg.sender == game.player2,
            "only player 1 and player 2 can play");
        require(game.currentState == GameState.BothPlayersJoined || 
        game.currentState == GameState.AwaitingNewBets,"game not in active state");
        require(guessNumber > 0 && guessNumber <= 10,"Guess must be between 1 and 10");


        require(msg.value >= game.minimumBet,
            "Insufficient bet, please match minimum bet");

        if (msg.sender == game.player1) {
            require(!game.p1BetStatus, "You have already bet");
            game.player1 = payable(msg.sender);
            game.player1Bet += msg.value;
            game.player1Guess = guessNumber;
            game.p1BetStatus = true;
        } else if (msg.sender == game.player2) {
            require(!game.p2BetStatus, "You have already bet");
            game.player2 = payable(msg.sender);
            game.player2Bet += msg.value;
            game.player2Guess = guessNumber;
            game.p2BetStatus = true;
        }

        if (game.p1BetStatus && game.p2BetStatus) {
            game.currentState = GameState.BothPlayerFinishBet;
        }

        if (game.currentState == GameState.BothPlayerFinishBet) {
            finalizeGame(gameId);
        }
    }

    function finalizeGame(uint256 gameId) internal {
        Game storage game = games[gameId];

        require(game.currentState != GameState.GameEnded,
            "Game has already ended");

        if (game.player1Guess == game.targetNumber && game.player2Guess == game.targetNumber) {
            game.currentState = GameState.GameEnded;
            uint256 totalBet = game.player1Bet + game.player2Bet;
            uint256 player1Share = (address(this).balance * game.player1Bet) /
                totalBet;
            uint256 player2Share = (address(this).balance * game.player2Bet) /
                totalBet;
            payable(game.player1).transfer(player1Share);
            payable(game.player2).transfer(player2Share);
            resetGame(gameId);
        } else if (game.player1Guess == game.targetNumber) {
            game.currentState = GameState.GameEnded;
            payable(game.player1).transfer(address(this).balance);
            resetGame(gameId);
        } else if (game.player2Guess == game.targetNumber) {
            game.currentState = GameState.GameEnded;
            payable(game.player2).transfer(address(this).balance);
            resetGame(gameId);
        } else {
            game.currentState = GameState.AwaitingNewBets;
            game.p1BetStatus = game.p2BetStatus = false;
        }
    }

    function getTargetNumber(uint256 gameId) public view returns(uint256) {
        require(msg.sender == owner,
            "Only the owner can view the target number");
        return games[gameId].targetNumber;
    }

    function withdraw(uint256 gameId) public nonReentrant {
        Game storage game = games[gameId];

        require(msg.sender == game.player1 || msg.sender == game.player2, "Not a player");
        require(game.currentState != GameState.GameEnded, "Game has already ended");
        require(game.player1Bet > 0 && game.player2Bet > 0, "Player must have balance");
        game.player1Bet = 0;
        game.player2Bet = 0;
        if (msg.sender == game.player1) {
            _withdraw(game.player1, game.player1Bet);
            payable(game.player2).transfer(game.player2Bet);
        } else if (msg.sender == game.player2) {
            _withdraw(game.player2, game.player2Bet);
            payable(game.player1).transfer(game.player1Bet);
        }
        game.currentState = GameState.GameEnded; // Set the game state to ended
    }

    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        unclaimedBalance -= int256(amount); // Subtract the withdrawn amount from the unclaimed balance
        owner.transfer(amount);
    }

    function generateTargetNumber() private view returns(uint256) {
    uint256 randomNumber = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 10) + 1;
        return randomNumber;
    }

    function resetGame(uint256 gameId) private {
        Game storage game = games[gameId];

        game.targetNumber = generateTargetNumber();
        game.player1 = payable(address(0));
        game.player2 = payable(address(0));
        game.p1BetStatus = game.p2BetStatus = false;
        game.player1Bet = game.player2Bet = 0;
        game.minimumBet = defaultMinBet;
        game.currentState = GameState.GameEnded;
    }

    function _withdraw(address payable player, uint256 betAmount) private {
        uint256 amount = betAmount / 2;  // Calculate 50% of the bet amount
        unclaimedBalance += int256(amount);
        player.transfer(amount);
    }
}