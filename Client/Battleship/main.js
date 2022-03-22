// var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/ws/");
var webSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host.split(":")[0] + ":7116");

webSocket.onopen = function (event) {
	webSocket.send(JSON.stringify({
		type: "selectGame",
		game: "battleship"
	}));
};

//Experimenting with a game state in this project.

var gameState = "waiting";

webSocket.onmessage = function (event) {
	var parsedData = JSON.parse(event.data);
	console.log(parsedData);
	if(parsedData.type == "pair") {
		gameState = "placingShips";
		updateGameState()
	} else if(parsedData.type == "left") {
		gameState = "waiting";
		updateGameState()
	} else if(parsedData.type == "placedShips") {
		if(gameState == "waitingShips") {
			gameState = "yourTurn";
			updateGameState();
			webSocket.send(JSON.stringify({
				type: "startTurns"
			}));
		}
	} else if(parsedData.type == "startTurns") {
		gameState = "opponentTurn";
		updateGameState();
	}
}

window.onload = function (){
	updateGameboard();
}

function updateGameState() {
	var gameTextElem = document.getElementById("gameText");

	if(gameState === "waiting") {
		gameTextElem.innerHTML = "Pairing up with opponent...";
	} else if(gameState === "placingShips") {
		var lengthsNeeded = shipLengths.slice();
		for(var i = 0; i < ships.length; i++) {
			if(lengthsNeeded.indexOf(ships[i].length) !== -1) {
				lengthsNeeded.splice(lengthsNeeded.indexOf(ships[i].length), 1);
			}
		}
		if(lengthsNeeded.length > 1) {
			gameTextElem.innerHTML = "Place your ships now by clicking and dragging on the gameboard.<br>You still need ships of length ";
			gameTextElem.innerHTML += lengthsNeeded.slice(0, -1).join(", ");
			//Make sure the last element has and before it
			gameTextElem.innerHTML += ` and ${lengthsNeeded[lengthsNeeded.length - 1]}`;
		} else if(lengthsNeeded.length === 1) {
			gameTextElem.innerHTML = `Place your ships now by clicking and dragging on the gameboard.<br>You still need a ship of length ${lengthsNeeded[0]}.`;
		} else {
			gameState = "waitingShips";
			updateGameState();
		}
	} else if(gameState === "waitingShips") {
		gameTextElem.innerHTML = "Waiting for opponent to place ships...";
	} else if(gameState === "yourTurn") {
		gameTextElem.innerHTML = "It's your turn! Click on a square to see if it's a hit or miss.";
	} else if(gameStae === "opponentTurn") {
		gameTextElem.innerHTML = "Waiting for your turn...";
	}
}

var gameBoardWidth = 10;
var gameBoardHeight = 10;

var letterOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var shipLengths = [2, 3, 4, 5];

var yourGameBoard = [];
var opponentGameBoard = [];

var ships = [];

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
				<div class="game-space" onclick="clickSpace(${i}, ${j})" onmousedown="mouseDownSpace(${i}, ${j})" onmouseup="mouseUpSpace(${i}, ${j})" onmouseover="hoverSpace(${i}, ${j})" id="yourSquarex${i}y${j}"></div>
			`; 
		}
		addHTML += "</div>";
	}
	addHTML += "<div class='battleships'>";
	for(var j = 0; j < ships.length; j++) {
		// Make sure the width and height will be positive by flipping the vlues if necessary
		var x1 = ships[j].x1;
		var y1 = ships[j].y1;
		var x2 = ships[j].x2;
		var y2 = ships[j].y2;
		if(x1 > x2) {
			var temp = x1;
			x1 = x2;
			x2 = temp;
		}
		if(y1 > y2) {
			var temp = y1;
			y1 = y2;
			y2 = temp;
		}

		addHTML += `<div class='battleship' id='yourShip${j}' style='--ship-x1: ${x1 - 1}; --ship-y1: ${y1 - 1}; --ship-x2: ${x2 - 1}; --ship-y2: ${y2 - 1};'></div>`;
	}
	if(draggingShip) {
		// Make sure the width and height will be positive by flipping the vlues if necessary
		var x1 = dragStartX;
		var y1 = dragStartY;
		var x2 = dragX;
		var y2 = dragY;
		if(x1 > x2) {
			var temp = x1;
			x1 = x2;
			x2 = temp;
		}
		if(y1 > y2) {
			var temp = y1;
			y1 = y2;
			y2 = temp;
		}
		addHTML += `<div class='battleship ${dragInvalid ? 'invalid' : ''}' id='yourShip${ships.length}' style='--ship-x1: ${x1 - 1}; --ship-y1: ${y1 - 1}; --ship-x2: ${x2 - 1}; --ship-y2: ${y2 - 1};'></div>`;
	}
	addHTML += "</div>";
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

var draggingShip = false;
var dragStartX = 0, dragStartY = 0, dragX = 0, dragY = 0, dragInvalid = false;

function clickSpace(x, y) {
	if(gameState === "yourTurn") {
		webSocket.send(JSON.stringify({
			type: "checkSpace",
			x: x,
			y: y
		}));
	}
}
function mouseDownSpace(x, y) {
	if(gameState === "yourTurn") {
		draggingShip = true;
		dragInvalid = false;
		dragStartX = x;
		dragStartY = y;
		dragX = x;
		dragY = y;
		updateGameboard();
	}
}
function hoverSpace(x, y) {
	if(gameState === "yourTurn") {
		if(draggingShip) {
			dragX = x;
			dragY = y;
			// Make sure the ship is only 1 wide or tall
			if(dragX - dragStartX !== 0 && dragY - dragStartY !== 0) {
				dragX = dragStartX;
			}
			if(dragY - dragStartY !== 0 && dragX - dragStartX !== 0) {
				dragY = dragStartY;
			}
			var length = Math.abs(dragX - dragStartX) + Math.abs(dragY - dragStartY) + 1;
			if(shipLengths.indexOf(length) == -1 || ships.map(ship => ship.length).indexOf(length) !== -1) {
				dragInvalid = true;
			} else {
				dragInvalid = false;
			}
			updateGameboard();
		}
	}
}
function mouseUpSpace(x, y) {
	if(gameState === "yourTurn") {
		draggingShip = false;
		if(dragInvalid) {
			updateGameboard();
			return
		}
		dragX = x;
		dragY = y;
		if(dragX - dragStartX !== 0 && dragY - dragStartY !== 0) {
			dragX = dragStartX;
		}
		if(dragY - dragStartY !== 0 && dragX - dragStartX !== 0) {
			dragY = dragStartY;
		}
		var length = Math.abs(dragX - dragStartX) + Math.abs(dragY - dragStartY) + 1;
		var ship = {x1: dragStartX, y1: dragStartY, x2: dragX, y2: dragY, length: length};
		ships.push(ship);
		//Check if we have all the ships placed
		if(ships.length == shipLengths.length) {
			webSocket.send(JSON.stringify({
				type: "placedShips",
				game: "battleship"
			}));
		}
		updateGameState();
		updateGameboard();
	}
}