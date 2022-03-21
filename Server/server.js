var websocketserver = require('ws').Server;

var wss = new websocketserver({ port: 7116 });

var clients = [];

wss.on('connection', function (ws) {
    console.log('Client connected');
    ws.on('message', function (message) {
        console.log('received: %s', message);
    });
});

console.log('Server started');