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
				type: "startTurns",
				game: "battleship"
			}));
		}
	} else if(parsedData.type == "startTurns") {
		gameState = "opponentTurn";
		updateGameState();
	} else if(parsedData.type == "checkSpace") {
		// Check if any of the ships intercept the space
		var shipIntercepted = false;
		for(var i = 0; i < ships.length; i++) {
			var x1 = ships[i].x1;
			var y1 = ships[i].y1;
			var x2 = ships[i].x2;
			var y2 = ships[i].y2;
			if(x2 - x1 < 0) {
				var temp = x1;
				x1 = x2;
				x2 = temp;
			}
			if(y2 - y1 < 0) {
				var temp = y1;
				y1 = y2;
				y2 = temp;
			}
			if(x1 <= parsedData.x && x2 >= parsedData.x && y1 <= parsedData.y && y2 >= parsedData.y) {
				shipIntercepted = true;
				break;
			}
		}

		yourGameBoard[parsedData.x - 1][parsedData.y - 1] = "X";
		gameState = "yourTurn";

		if(shipIntercepted) {
			webSocket.send(JSON.stringify({
				type: "spaceUpdate",
				event: "hit",
				game: "battleship",
				x: parsedData.x,
				y: parsedData.y
			}));
		} else {
			webSocket.send(JSON.stringify({
				type: "spaceUpdate",
				event: "miss",
				game: "battleship",
				x: parsedData.x,
				y: parsedData.y
			}));
		}
		updateGameState();
		updateGameboard();
	} else if(parsedData.type == "spaceUpdate") {
		if(parsedData.event == "hit") {
			opponentGameBoard[parsedData.x - 1][parsedData.y - 1] = "X";
		} else if(parsedData.event == "miss") {
			opponentGameBoard[parsedData.x - 1][parsedData.y - 1] = "O";
		}
		updateGameboard();
	} else if(parsedData.type == "shipSunk") {
		gameState = "sunkShip";
		sunkShip = parsedData.ship;
		updateGameState();
	} else if(parsedData.type == "gameOver") {
		gameState = "youWin";
		updateGameState();
	} else if(parsedData.type == "restart") {
		restartGame();
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
	} else if(gameState === "opponentTurn") {
		gameTextElem.innerHTML = "Waiting for your turn...";
	} else if(gameState === "shipSunk") {
		gameTextElem.innerHTML = `One of your ships has been sunk!<br>You have ${ships.length - 1} ships remaining.`;
	} else if(gameState === "sunkShip") {
		gameTextElem.innerHTML = `You sunk your opponent's ${sunkShip} ship!`;
	} else if(gameState === "gameOver") {
		gameTextElem.innerHTML = "Game over! All your ships sunk and you lost!";
		var restartContainer = document.getElementById("restartContainer");
		restartContainer.style.display = "flex";
	} else if(gameState === "youWin") {
		gameTextElem.innerHTML = "Game over! You sunk all your opponent's ships and won!";
		var restartContainer = document.getElementById("restartContainer");
		restartContainer.style.display = "flex";
	}
}

function restart() {
	restartGame();
	webSocket.send(JSON.stringify({
		type: "restart",
		game: "battleship"
	}));
}

function restartGame() {
	var restartContainer = document.getElementById("restartContainer");
	restartContainer.style.display = "none";

	ships = [];
	shipsSunk = [];
	yourGameBoard = [];
	opponentGameBoard = [];
	initGameBoards();
	gameState = "placingShips";
	updateGameState();
	updateGameboard();
}

var gameBoardWidth = 10;
var gameBoardHeight = 10;

var letterOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var shipLengths = [2, 3, 4, 5];

var yourGameBoard = [];
var opponentGameBoard = [];

var ships = [];
var shipsSunk = [];
var shipSunk = 0;

function initGameBoards() {
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
}
initGameBoards();

function updateGameboard() {
	var yourGameBoardElem = document.getElementById("yourGameBoard");

	if(gameState !== "placingShips") {
		var oldShipsSunk = shipsSunk.slice();

		// Check if any new battleships are sunk
		for(var i = 0; i < ships.length; i++) {
			// loop through the ship's coordinates
			var shipSunk = true;
			var x1 = ships[i].x1;
			var y1 = ships[i].y1;
			var x2 = ships[i].x2;
			var y2 = ships[i].y2;

			if(x2 - x1 < 0) {
				var temp = x1;
				x1 = x2;
				x2 = temp;
			}
			if(y2 - y1 < 0) {
				var temp = y1;
				y1 = y2;
				y2 = temp;
			}

			for(var j = x1; j <= x2; j++) {
				for(var k = y1; k <= y2; k++) {
					if(yourGameBoard[j - 1][k - 1] !== "X") {
						shipSunk = false;
						break;
					}
				}
			}
			if(shipSunk && shipsSunk.indexOf(i) === -1) {
				shipsSunk.push(i);
			}
		}

		if(shipsSunk.length > oldShipsSunk.length) {
			// A new ship has been sunk
			gameState = "shipSunk";
			updateGameState();
			if(shipsSunk.length === ships.length) {
				gameState = "gameOver";
				updateGameState();
				webSocket.send(JSON.stringify({
					type: "gameOver",
					game: "battleship"
				}));
				return;
			}
			webSocket.send(JSON.stringify({
				type: "shipSunk",
				game: "battleship",
				ship: ships[shipsSunk[shipsSunk.length - 1]].length
			}));
			setTimeout(function() {
				gameState = "yourTurn";
				updateGameState();
			}, 2000);
		}
	}

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
				<div class="game-space" onmousedown="mouseDownSpace(${i}, ${j})" onmouseup="mouseUpSpace(${i}, ${j})" onmouseover="hoverSpace(${i}, ${j})" id="yourSquarex${i}y${j}">${yourGameBoard[i - 1][j - 1] === "X" ? "<span class='game-space-hit'>X</span>" : ""}</div>
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
				<div onmousedown="mouseDownSpace(${i}, ${j})" class="game-space">${opponentGameBoard[i - 1][j - 1] === "X" ? "<span class='game-space-hit'>X</span>" : ""}${opponentGameBoard[i - 1][j - 1] === "O" ? "<span class='game-space-miss'>O</span>" : ""}</div>
			`; 
		}
		addHTML += "</div>";
	}
	opponentGameBoardElem.innerHTML += addHTML;
}

var draggingShip = false;
var dragStartX = 0, dragStartY = 0, dragX = 0, dragY = 0, dragInvalid = false;

function mouseDownSpace(x, y) {
	if(gameState === "placingShips") {
		draggingShip = true;
		dragInvalid = false;
		dragStartX = x;
		dragStartY = y;
		dragX = x;
		dragY = y;
		updateGameboard();
	} else if(gameState === "yourTurn") {
		webSocket.send(JSON.stringify({
			type: "checkSpace",
			game: "battleship",
			x: x,
			y: y
		}));
		gameState = "opponentTurn";
	    updateGameState();
		updateGameboard();
	}
}
function hoverSpace(x, y) {
	if(gameState === "placingShips") {
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
	if(gameState === "placingShips") {
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