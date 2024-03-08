// import { Server } from 'ws';
import WebSocket, { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 3000 });

// on server connection
server.on('connection', socket => {
    socket.on('message', message => {
        const c = Buffer.from(message)
        console.log("message", message.toString());
        socket.send(`${message}`)
    })
})