import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


pragma solidity ^ 0.8.0;

contract NumberGame is ReentrancyGuard {
    enum GameState {
        NewGame,
        WaitingForPlayer,
        BothPlayersJoined,
        AwaitingNewBets,
        GameEnded
    }

    struct Game {
        address payable player1;
        address payable player2;
        uint256 player1Bet;
        uint256 player2Bet;
        uint256 minimumBet;
        uint8 player1Guess;
        uint8 player2Guess;
        GameState currentState;
        bool p1BetStatus;
        bool p2BetStatus;
    }

    address payable public owner;
    uint256 public defaultMinBet;
    int256 public unclaimedBalance;

    event GameCreated(uint256 gameId);

    // gameId -> Game mapping
    mapping(uint256 => Game) public games;
    mapping(uint256 => uint8) private targetNumbers;


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

        require(games[gameId].currentState == GameState.GameEnded ||
            games[gameId].currentState == GameState.NewGame,
            "create game - game state error");

        games[gameId] = Game({
            player1: payable(address(0)),
            player2: payable(address(0)),
            player1Bet: 0,            // Default value
            player2Bet: 0,            // Default value
            minimumBet: defaultMinBet,
            player1Guess: 0,          // Default value
            player2Guess: 0,          // Default value
            currentState: GameState.NewGame,
            p1BetStatus: false,
            p2BetStatus: false
        });
        
        targetNumbers[gameId] = uint8(generateTargetNumber());
        emit GameCreated(gameId);
        return gameId;
    }


    receive() external payable {
        unclaimedBalance += int256(msg.value);
    }


    function joinGame(uint16 gameId) public payable {

        require(msg.sender != owner, "Owner cannot join the game");
        require(msg.value >= defaultMinBet,
            "Please send more than default minimum bet to join the game"
        );
        Game storage game = games[gameId];
        require(msg.sender != game.player1, "You have already joined the game");
        require(game.currentState == GameState.NewGame ||
            game.currentState == GameState.WaitingForPlayer,
            "game is either ended or full"
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

    function makeGuess(uint16 gameId, uint8 guessNumber) public payable {
        Game storage game = games[gameId];

        require(msg.sender == game.player1 || msg.sender == game.player2,
            "only player 1 and player 2 can play");
        require(game.currentState == GameState.BothPlayersJoined ||
            game.currentState == GameState.AwaitingNewBets, "game not in active state");
        require(guessNumber > 0 && guessNumber <= 10, "Guess must be between 1 and 10");
        require(msg.value == game.minimumBet, "Please match bet amount");

        bool isPlayer1 = (msg.sender == game.player1);

        require((isPlayer1 && !game.p1BetStatus) || (!isPlayer1 && !game.p2BetStatus),
            "You have already bet");

        if (isPlayer1) {
            game.player1Bet += msg.value;
            game.player1Guess = guessNumber;
            game.p1BetStatus = true;
        } else {
            game.player2Bet += msg.value;
            game.player2Guess = guessNumber;
            game.p2BetStatus = true;
        }

        if (game.p1BetStatus && game.p2BetStatus) {
            finalizeGame(gameId);
        }
    }

    function finalizeGame(uint16 gameId) internal {
        Game storage game = games[gameId];

         uint8 currentTargetNumber = targetNumbers[gameId];
        if (game.player1Guess == currentTargetNumber && game.player2Guess == currentTargetNumber) {
            game.currentState = GameState.GameEnded;
            payable(game.player1).transfer(game.player1Bet);
            payable(game.player2).transfer(game.player2Bet);
            game.player1Bet = 0;
            game.player2Bet = 0;
        } else if (game.player1Guess == currentTargetNumber) {
            game.currentState = GameState.GameEnded;
            payable(game.player1).transfer(game.player1Bet + game.player2Bet);
            game.player1Bet = 0;
            game.player2Bet = 0;
        } else if (game.player2Guess == currentTargetNumber) {
            game.currentState = GameState.GameEnded;
            payable(game.player2).transfer(game.player1Bet + game.player2Bet);
            game.player1Bet = 0;
            game.player2Bet = 0;
        } else {
            game.currentState = GameState.AwaitingNewBets;
            game.p1BetStatus = game.p2BetStatus = false;
        }
    }

    function getTargetNumber(uint16 gameId) public view returns(uint256) {
    require(msg.sender == owner, "Not authorized");
    return targetNumbers[gameId];
    }

    function withdraw(uint16 gameId) public nonReentrant{
        Game storage game = games[gameId];

        require(msg.sender == game.player1 || msg.sender == game.player2, "Not a player");
        require(game.currentState != GameState.GameEnded ||
            game.currentState != GameState.NewGame, "Game has already ended");
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
        game.currentState = GameState.GameEnded;
    }

    function setNextGameId(uint16 _nextGameId) external onlyOwner {
        require(_nextGameId > 0 && _nextGameId < nextGameId, "Invalid game ID");
        nextGameId = _nextGameId;
    }


    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        unclaimedBalance -= int256(amount); // Subtract the withdrawn amount from the unclaimed balance
        owner.transfer(amount);
    }


    function generateTargetNumber() private view  returns(uint256) {
    uint256 randomNumber = (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10) + 1;
        return randomNumber;
    }

    function resetGame(uint16 gameId) external onlyOwner {
        Game storage game = games[gameId];

        // Ensure the game is in a valid state before resetting
        require(
            game.currentState != GameState.GameEnded &&
            game.currentState != GameState.NewGame,  // or any other states you want to allow
            "Cannot reset game in current state"
        );

        // Update unclaimed balance
        game.player1Bet = 0;
        game.player2Bet = 0;
        unclaimedBalance += int256(game.player1Bet);
        unclaimedBalance += int256(game.player2Bet);

        game.currentState = GameState.GameEnded;
    }

    function _withdraw(address payable player, uint256 betAmount) private {
        uint256 amount = betAmount / 2;  // Calculate 50% of the bet amount
        unclaimedBalance += int256(amount);
        player.transfer(amount);
    }
}