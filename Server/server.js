var websocketserver = require('ws').Server;

var wss = new websocketserver({ port: 7116 });

var clients = [];

wss.on('connection', function (ws) {
    console.log('Client connected');
    var paired = false;
    clients.forEach(function (client) {
        if(client.playingWith === null) {
            client.playingWith = { ws: ws, inGame: true, playingWith: null };
            client.ws.send(JSON.stringify({ type: "pair", playingAs: "X", yourTurn: true }));
            ws.send(JSON.stringify({ type: "pair", playingAs: "O", yourTurn: false }));
            paired = true;
        }
    });
    if(!paired) {
        clients.push({ws: ws, inGame: false, playingWith: null});
    }
    ws.on('message', function (message) {
        var parsedData = JSON.parse(message);
        if(parsedData.type === "move") {
            clients.forEach(function (client) {
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
            clients.forEach(function (client) {
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
    });
    ws.on('close', function () {
        console.log('Client disconnected');
        clients.forEach(function (client, index) {
            if(client.ws === ws) {
                if(client.playingWith !== null) {
                    client.playingWith.ws.send(JSON.stringify({type: "left"}));
                    client.playingWith.inGame = false;
                    clients.push(client.playingWith);
                }
                clients.splice(index, 1);
            }
        });
    });
});

console.log('Server started');