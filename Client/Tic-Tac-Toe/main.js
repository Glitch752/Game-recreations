var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws/");
// var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host.split(":")[0] + ":7116");

webSocket.onopen = function (event) {
    webSocket.send(JSON.stringify({
        type: "selectGame",
        game: "tic-tac-toe"
    }));
    console.log("Connected to server");
};

webSocket.onmessage = function (event) {
    var parsedData = JSON.parse(event.data);
    console.log(parsedData);
    if(parsedData.type === "pair") {
        inGame = true;
        yourTurn = parsedData.yourTurn;
        playingAs = parsedData.playingAs;
        
        var replayButtonElem = document.getElementById("replayButton");
        replayButtonElem.style.display = "none";
        
        winner = null;
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        updateGameboard();

        updatePlayingAs();
        updateGameText();
    } else if(parsedData.type === "move") {
        gameBoard[parsedData.index] = playingAs === "X" ? "O" : "X";
        yourTurn = true;
        updateGameText();
        updateGameboard();
    } else if(parsedData.type === "left") {
        inGame = false;
        yourTurn = false;
        playingAs = "";
        winner = null;
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        updateGameboard();
        updatePlayingAs();
        updateGameText();
    }
}

var playingAs = "X";

var gameBoard = ["", "", "", "", "", "", "", "", ""];

var yourTurn = true;

var inGame = false;

var winner = null; //Null if no winner, "X" or "O" if a winner.

window.onload = function (){
    updateGameboard();
    updatePlayingAs();
    updateGameText();
}

function replay() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    winner = null;
    inGame = false;
    yourTurn = false;
    updateGameboard();
    updateGameText();
    updatePlayingAs();
    webSocket.send(JSON.stringify({
        type: "replay",
        game: "tic-tac-toe"
    }));
}

function updateGameboard() {
    var gameBoardElem = document.getElementById("gameBoard");

    gameBoardElem.innerHTML = "";
    for (var i = 0; i < gameBoard.length; i++) {
        gameBoardElem.innerHTML += `
            <div class="game-space" onclick="selectSquare(${i})">${gameBoard[i] === "X" ? `<span class="square-x">X</span>` : ``}${gameBoard[i] === "O" ? `<span class="square-o">O</span>` : ``}</div>
        `;
    }

    // Detect if either player has won
    var winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (var i = 0; i < winningCombos.length; i++) {
        var combo = winningCombos[i];
        if (gameBoard[combo[0]] !== "" && gameBoard[combo[0]] === gameBoard[combo[1]] && gameBoard[combo[1]] === gameBoard[combo[2]]) {
            winner = gameBoard[combo[0]];
            updateGameText();
            inGame = false;
            var replayButtonElem = document.getElementById("replayButton");
            replayButtonElem.style.display = "block";
            return;
        }
    }

    // Detect if the game is a tie
    if(gameBoard.indexOf("") === -1) {
        winner = "tie";
        updateGameText();
        inGame = false;
        var replayButtonElem = document.getElementById("replayButton");
        replayButtonElem.style.display = "block";
        return;
    }
}

function updatePlayingAs() {
    if(!inGame) {
        var playingTextElem = document.getElementById("playingText");
        playingTextElem.innerHTML = "You're not in a game yet.";
    } else {
        var playingTextElem = document.getElementById("playingText");
        playingTextElem.innerHTML = `You're playing as <span id="playingAs"></span>.`;

        var playingAsElem = document.getElementById("playingAs");

        playingAsElem.classList.remove("square-x");
        playingAsElem.classList.remove("square-o");

        playingAsElem.innerHTML = `${playingAs}`;

        if(playingAs === "X") {
            playingAsElem.classList.add("square-x");
        } else {
            playingAsElem.classList.add("square-o");
        }
    }
}

function updateGameText() {
    var gameTextElem = document.getElementById("gameText");
    
    if(winner !== null) {
        if(winner === "tie") {
            gameTextElem.innerHTML = "It's a tie!";
        } else {
            gameTextElem.innerHTML = `${winner} wins!`;
        }
    } else if(!inGame) {
        gameTextElem.innerHTML = "Pairing up with an opponent...";
    } else if(yourTurn) {
        gameTextElem.innerHTML = "Your turn";
    } else {
        gameTextElem.innerHTML = "Opponent's turn";
    }
}

function selectSquare(index) {
    if(yourTurn && gameBoard[index] === "" && inGame) {
        gameBoard[index] = playingAs;
        yourTurn = false;
        updateGameText();
        updateGameboard();
        webSocket.send(JSON.stringify({
            type: "move",
            index: index,
            game: "tic-tac-toe"
        }));
    }
}