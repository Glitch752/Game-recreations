var websocketserver = require('ws').Server;

var wss = new websocketserver({ port: 7116 });

var clients = []; //Stores what game clients are connected to.
var TTTclients = [];
var BattleshipClients = [];

wss.on('connection', function (ws) {
    console.log('Client connected');
    ws.on('message', function (message) {
        var parsedData = JSON.parse(message);
        if(parsedData.type === "selectGame") {
            if(parsedData.game === "tic-tac-toe") {
                var paired = false;
                TTTclients.forEach(function (client) {
                    if(client.playingWith === null) {
                        client.playingWith = { ws: ws, inGame: true, playingWith: null };
                        client.ws.send(JSON.stringify({ type: "pair", playingAs: "X", yourTurn: true }));
                        ws.send(JSON.stringify({ type: "pair", playingAs: "O", yourTurn: false }));
                        paired = true;
                    }
                });
                if(!paired) {
                    TTTclients.push({ws: ws, inGame: false, playingWith: null});
                }
                clients.push({ws: ws, game: "tic-tac-toe"});
            } else if(parsedData.game === "battleship") {
                var paired = false;
                BattleshipClients.forEach(function (client) {
                    if(client.playingWith === null) {
                        client.playingWith = { ws: ws, inGame: true, playingWith: null };
                        client.ws.send(JSON.stringify({ type: "pair"}));
                        ws.send(JSON.stringify({ type: "pair"}));
                        paired = true;
                    }
                });
                if(!paired) {
                    BattleshipClients.push({ws: ws, inGame: false, playingWith: null});
                }
                clients.push({ws: ws, game: "battleship"});
            }
        } else if(parsedData.game === "tic-tac-toe") {
            if(parsedData.type === "move") {
                TTTclients.forEach(function (client) {
                    if(client.ws === ws) {
                        client.playingWith.ws.send(JSON.stringify({
                            type: "move",
                            index: parsedData.index
                        }));
                    } else if(client.playingWith.ws === ws) {
                        client.ws.send(JSON.stringify({
                            type: "move",
                            index: parsedData.index
                        }));
                    }
                });
            } else if(parsedData.type === "replay") {
                TTTclients.forEach(function (client) {
                    if(client.ws === ws) {
                        if(client.playingAs === "X") {
                            client.playingWith.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "X",
                                yourTurn: true
                            }));
                            client.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "O",
                                yourTurn: false
                            }));
                        } else {
                            client.playingWith.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "O",
                                yourTurn: true
                            }));
                            client.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "X",
                                yourTurn: false
                            }));
                        }
                    } else if(client.playingWith.ws === ws) {
                        if(client.playingAs === "X") {
                            client.playingWith.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "X",
                                yourTurn: false
                            }));
                            client.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "O",
                                yourTurn: true
                            }));
                        } else {
                            client.playingWith.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "O",
                                yourTurn: false
                            }));
                            client.ws.send(JSON.stringify({
                                type: "pair",
                                playingAs: "X",
                                yourTurn: true
                            }));
                        }
                    }
                });
            }
        } else if(parsedData.game === "battleship") {
            if(parsedData.type === "placedShips") {
                BattleshipClients.forEach(function (client) {
                    if(client.ws === ws) {
                        client.playingWith.ws.send(JSON.stringify({
                            type: "placedShips"
                        }));
                    } else if(client.playingWith.ws === ws) {
                        client.ws.send(JSON.stringify({
                            type: "placedShips"
                        }));
                    }
                });
            } else if(parsedData.type === "startTurns") {
                BattleshipClients.forEach(function (client) {
                    if(client.ws === ws) {
                        client.playingWith.ws.send(JSON.stringify({
                            type: "startTurns"
                        }));
                    } else if(client.playingWith.ws === ws) {
                        client.ws.send(JSON.stringify({
                            type: "startTurns"
                        }));
                    }
                });
            } else if(parsedData.type === "checkSpace") {
                BattleshipClients.forEach(function (client) {
                    if(client.ws === ws) {
                        client.playingWith.ws.send(JSON.stringify({
                            type: "checkSpace",
                            x: parsedData.x,
                            y: parsedData.y
                        }));
                    } else if(client.playingWith.ws === ws) {
                        client.ws.send(JSON.stringify({
                            type: "checkSpace",
                            x: parsedData.x,
                            y: parsedData.y
                        }));
                    }
                });
            }
        }
    });
    ws.on('close', function () {
        console.log('Client disconnected');
        //Get the game the client was playing.
        var clientIndex = clients.findIndex(function (client) {
            return client.ws === ws;
        });

        var game = clients[clientIndex];

        if(game !== undefined) {
            game = game.game;
        } else {
            return;
        }

        clients.splice(clientIndex, 1);

        if(game === "tic-tac-toe") {
            TTTclients.forEach(function (client, index) {
                if(client.ws === ws) {
                    if(client.playingWith !== null) {
                        client.playingWith.ws.send(JSON.stringify({type: "left"}));
                        client.playingWith.inGame = false;
                        TTTclients.push(client.playingWith);
                    }
                    TTTclients.splice(index, 1);
                }
            });
        } else if(game === "battleship") {
            BattleshipClients.forEach(function (client, index) {
                if(client.ws === ws) {
                    if(client.playingWith !== null) {
                        client.playingWith.ws.send(JSON.stringify({type: "left"}));
                        client.playingWith.inGame = false;
                        BattleshipClients.push(client.playingWith);
                    }
                    BattleshipClients.splice(index, 1);
                }
            });
        }
    });
});

console.log('Server started');