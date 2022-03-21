// var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws/");
var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host.split(":")[0] + ":7116");

webSocket.onopen = function (event) {
    console.log("Connected to server");
};

var playingAs = "X";

var gameBoard = ["", "", "", "", "", "", "", "", ""];

window.onload = function () {
    updateGameboard();
    updatePlayingAs();
}

function updateGameboard() {
    var gameBoardElem = document.getElementById("gameBoard");

    gameBoardElem.innerHTML = "";
    for (var i = 0; i < gameBoard.length; i++) {
        gameBoardElem.innerHTML += `
            <div class="game-space" onclick="selectSquare(${i})">${gameBoard[i] === "X" ? `<span class="square-x">X</span>` : ``}${gameBoard[i] === "O" ? `<span class="square-o">O</span>` : ``}</div>
        `;
    }
}

function updatePlayingAs() {
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

function selectSquare(index) {
    gameBoard[index] = playingAs;
    updateGameboard();
}