var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws/");
// var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host.split(":")[0] + ":7116");

webSocket.onopen = function (event) {
	webSocket.send(JSON.stringify({
		type: "selectGame",
		game: "connect4"
	}));
};

//Using game state again in this project

var gameState = "waiting";

webSocket.onmessage = function (event) {
	var parsedData = JSON.parse(event.data);
	console.log(parsedData);
	if(parsedData.type === "pair") {
		gameState = parsedData.yourTurn ? "yourTurn" : "oppTurn";
		updateGameState();
	} else if(parsedData.type === "move") {
		yourGameBoard[parsedData.row][parsedData.col] = "opp";
		updateGameboard();
		gameState = "yourTurn";
		updateGameState();
	} else if(parsedData.type === "win") {
		console.log("You have lost.");
		gameState = "lose";
		updateGameState();
	} else if(parsedData.type === "replay") {
		resetGame();
	}
}

window.onload = function (){
	updateGameboard();
}

function updateGameState() {
	var gameTextElem = document.getElementById("gameText");

	if(gameState === "waiting") {
		gameTextElem.innerHTML = "Pairing up with opponent...";
	} else if(gameState === "yourTurn") {
		gameTextElem.innerHTML = "Your turn!";
	} else if(gameState === "oppTurn") {
		gameTextElem.innerHTML = "Waiting for turn...";
	} else if(gameState === "win") {
		gameTextElem.innerHTML = "You win!";
		var replayButton = document.getElementById("replayButton");
		replayButton.style.display = "inline-block";
	} else if(gameState === "lose") {
		gameTextElem.innerHTML = "You lost!";
		var replayButton = document.getElementById("replayButton");
		replayButton.style.display = "inline-block";
	}
}

var gameBoardWidth = 7;
var gameBoardHeight = 6;

var winSize = 4;

var yourGameBoard = [];

function initGameBoard() {
	for(var i = 0; i < gameBoardHeight; i++){
		yourGameBoard[i] = [];
		for(var j = 0; j < gameBoardWidth; j++){
			yourGameBoard[i][j] = "";
		}
	}
}
initGameBoard();

function updateGameboard() {
	var yourGameBoardElem = document.getElementById("yourGameBoard");

	// Check for wins
	var hasWon = checkForWin();
	if(hasWon) {
		gameState = "win";
		updateGameState();
		webSocket.send(JSON.stringify({
			type: "win",
			game: "connect4"
		}));
	}

	yourGameBoardElem.innerHTML = "";
	var addHTML = "";
	for (var i = 0; i < yourGameBoard.length; i++) {
		addHTML += `<div class='game-row'>`;
		for (var j = 0; j < yourGameBoard[i].length; j++) {
			addHTML += `<div class="game-space" onmouseover="mouseOverSquare(${i}, ${j})" onmouseleave="mouseLeaveSquare(${i}, ${j})" onmouseup="mouseUpSquare(${i}, ${j})">
				<div class='game-circle' id='gameCircleRow${i}Col${j}'>
					${yourGameBoard[i][j] === "you" ? `<div class='game-circle-you'></div>` : ``}
					${yourGameBoard[i][j] === "opp" ? `<div class='game-circle-opp'></div>` : ``}
				</div>
			</div>`;
		}
		addHTML += "</div>";
	}
	yourGameBoardElem.innerHTML = addHTML;
}

function checkForWin() {
	// Check for horizontal wins
	for(var i = 0; i < gameBoardHeight; i++){
		var count = 0;
		for(var j = 0; j < gameBoardWidth; j++){
			if(yourGameBoard[i][j] === "you") {
				count++;
				if(count >= winSize) {
					return true;
				}
			} else {
				count = 0;
			}
		}
	}
	// Check for vertical wins
	for(var i = 0; i < gameBoardWidth; i++){
		var count = 0;
		for(var j = 0; j < gameBoardHeight; j++){
			if(yourGameBoard[j][i] === "you") {
				count++;
				if(count >= winSize) {
					return true;
				}
			} else {
				count = 0;
			}
		}
	}
	// Check for diagonal wins
	for(var i = 0; i < gameBoardWidth; i++){
		for(var j = 0; j < gameBoardHeight; j++){
			if(yourGameBoard[j][i] === "you") {
				if(i - winSize > -1 && j - winSize > -1) {
					var count = 0;
					for(var k = 0; k < winSize; k++){
						if(yourGameBoard[j - k][i - k] === "you") {
							count++;
							if(count >= winSize) {
								return true;
							}
						} else {
							count = 0;
						}
					}
				}
				if(i + winSize < gameBoardWidth && j + winSize < gameBoardHeight) {
					var count = 0;
					for(var k = 0; k < winSize; k++){
						if(yourGameBoard[j + k][i + k] === "you") {
							count++;
							if(count >= winSize) {
								return true;
							}
						} else {
							count = 0;
						}
					}
				}
				if(i - winSize > -1 && j + winSize < gameBoardHeight) {
					var count = 0;
					for(var k = 0; k < winSize; k++){
						if(yourGameBoard[j + k][i - k] === "you") {
							count++;
							if(count >= winSize) {
								return true;
							}
						} else {
							count = 0;
						}
					}
				}
				if(i + winSize < gameBoardWidth && j - winSize > -1) {
					var count = 0;
					for(var k = 0; k < winSize; k++){
						if(yourGameBoard[j - k][i + k] === "you") {
							count++;
							if(count >= winSize) {
								return true;
							}
						} else {
							count = 0;
						}
					}
				}
			}
		}
	}

	return false;
}

function mouseOverSquare(row, col) {
	if(gameState === "yourTurn") {
		row = getLowestEmptySpace(col);
		if(row === -1) return;
		var gameCircle = document.getElementById(`gameCircleRow${row}Col${col}`);
		gameCircle.style.backgroundColor = "lightblue";
	}
}
function mouseLeaveSquare(row, col) {
	if(gameState === "yourTurn") {
		row = getLowestEmptySpace(col);
		if(row === -1) return;
		var gameCircle = document.getElementById(`gameCircleRow${row}Col${col}`);
		gameCircle.style.backgroundColor = "";
	}
}
function mouseUpSquare(row, col) {
	if(gameState === "yourTurn") {
		row = getLowestEmptySpace(col);
		if(row === -1) return;
		var gameCircle = document.getElementById(`gameCircleRow${row}Col${col}`);
		gameCircle.style.backgroundColor = "";
		yourGameBoard[row][col] = "you";
		gameState = "oppTurn";
		updateGameState();
		webSocket.send(JSON.stringify({
			type: "move",
			game: "connect4",
			row: row,
			col: col
		}));
		updateGameboard();
	}
}
function replay() {
	resetGame();
	
	webSocket.send(JSON.stringify({
		type: "replay",
		game: "connect4"
	}));
}

function resetGame() {
	var replayButton = document.getElementById("replayButton");
	replayButton.style.display = "none";

	initGameBoard();
	updateGameboard();

	gameState = "yourTurn";
	updateGameState();
}

function getLowestEmptySpace(col) {
	for(var i = gameBoardHeight - 1; i >= 0; i--){
		if(yourGameBoard[i][col] === ""){
			return i;
		}
	}
	return -1;
}