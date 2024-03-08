import { createServer } from "http"
import { Server } from 'socket.io';
const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV == "production" ? false : ['http://127.0.0.1:5500', 'http://localhost:5500']
    }
})

io.on("connection", (socket) => {
    console.log("user ", socket.id, " is connected")
    socket.on("message", (data) => {
        io.emit("message", `${socket.id.substring(0, 5)}: ${data}`)
    })
})

httpServer.listen(3500, () => {
    console.log("listening on port number 3500")
})