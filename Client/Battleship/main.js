// var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws/");
var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host.split(":")[0] + ":7116");

webSocket.onopen = function (event) {
	webSocket.send(JSON.stringify({
		type: "selectGame",
		game: "battleship"
	}));
};

webSocket.onmessage = function (event) {
	var parsedData = JSON.parse(event.data);
	console.log(parsedData);
	
}

window.onload = function (){
	updateGameboard();
}

var gameBoardWidth = 10;
var gameBoardHeight = 10;

var letterOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var yourGameBoard = [];
var opponentGameBoard = [];

for(var i = 0; i < gameBoardHeight; i++){
	yourGameBoard[i] = [];
	for(var j = 0; j < gameBoardWidth; j++){
		yourGameBoard[i][j] = "";
	}
}
for(var i = 0; i < gameBoardHeight; i++){
	opponentGameBoard[i] = [];
	for(var j = 0; j < gameBoardWidth; j++){
		opponentGameBoard[i][j] = "";
	}
}

function updateGameboard() {
	var yourGameBoardElem = document.getElementById("yourGameBoard");

	yourGameBoardElem.innerHTML = "";
	var addHTML = "";
	for (var i = 0; i < yourGameBoard.length + 1; i++) {
		if(i == 0) {
			addHTML += "<div class='game-row-letters'><div class='game-row-corner'></div>";
			for(var j = 0; j < gameBoardWidth; j++) {
				addHTML += `<div class='game-row-letter'>${letterOrder[j]}</div>`;
			}
			addHTML += "</div>";
			continue
		}
		addHTML += `<div class='game-row'>`;
		for (var j = 0; j < yourGameBoard[i - 1].length + 1; j++) {
			if(j == 0) {
				addHTML += `<div class='game-row-number'>${i}</div>`;
				continue
			}
			addHTML += `
				<div class="game-space"></div>
			`; 
		}
		addHTML += "</div>";
	}
	yourGameBoardElem.innerHTML += addHTML;

	var opponentGameBoardElem = document.getElementById("opponentGameBoard");

	opponentGameBoardElem.innerHTML = "";
	var addHTML = "";
	for (var i = 0; i < opponentGameBoard.length + 1; i++) {
		if(i == 0) {
			addHTML += "<div class='game-row-letters'><div class='game-row-corner'></div>";
			for(var j = 0; j < gameBoardWidth; j++) {
				addHTML += `<div class='game-row-letter'>${letterOrder[j]}</div>`;
			}
			addHTML += "</div>";
			continue
		}
		addHTML += `<div class='game-row'>`;
		for (var j = 0; j < opponentGameBoard[i - 1].length + 1; j++) {
			if(j == 0) {
				addHTML += `<div class='game-row-number'>${i}</div>`;
				continue
			}
			addHTML += `
				<div class="game-space"></div>
			`; 
		}
		addHTML += "</div>";
	}
	opponentGameBoardElem.innerHTML += addHTML;
}