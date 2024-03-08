// import { createServer } from "http"
import express from 'express';
import { Server } from 'socket.io';
import path from 'path'
import { fileURLToPath } from 'url';

const __filePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filePath)

console.log({ __filePath, __dirname })

const PORT = process.env.PORT || 3501
// const httpServer = createServer();
const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log("listening on port number 3500")
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV == "production" ? false : ['http://127.0.0.1:5500', 'http://localhost:5500']
    }
})

// const io = new Server(expressServer)

io.on("connection", (socket) => {
    // upon connection only to user
    socket.emit("message", `hay! welcome to chat room`)

    // upon connection only to other users
    socket.broadcast.emit("message", `${socket.id.substring(0, 5)} is connected`)

    // lisning to "message" event
    socket.on("message", (data) => {
        io.emit("message", `${socket.id.substring(0, 5)}: ${data}`)
    })

    // lisning to disconnect event.
    socket.on('disconnect', (data) => {
        socket.broadcast.emit("message", `${socket.id.substring(0, 5)} is disconnected`)
    })

    socket.on("activity", (typingMsg) => {
        socket.broadcast.emit("typing", `${typingMsg}`)
    })
})



// httpServer.listen(3500, () => {
//     console.log("listening on port number 3500")
// })