var websocketserver = require('ws').Server;

var wss = new websocketserver({ port: 7116 });

var clients = []; //Stores what game clients are connected to.
var TTTclients = [];

wss.on('connection', function (ws) {
    console.log('Client connected');
    ws.on('message', function (message) {
        var parsedData = JSON.parse(message);
        console.log(parsedData);
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
        }
    });
});

console.log('Server started');