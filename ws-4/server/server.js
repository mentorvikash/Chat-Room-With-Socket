// import { createServer } from "http"
import express from 'express';
import { Server } from 'socket.io';
import path from 'path'
import { fileURLToPath } from 'url';

const __filePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filePath)

const PORT = process.env.PORT || 3500
// const httpServer = createServer();
const app = express()
const ADMIN = 'Admin'

const userState = {
    users: [],
    setUsers: function (newUserArrry) {
        this.users = newUserArrry
    }
}

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log("listening on port number: " + 3500)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV == "production" ? false : ['http://127.0.0.1:5500', 'http://localhost:5500']
    }
})

// const io = new Server(expressServer)

io.on("connection", (socket) => {
    // console.log("socket is connected")
    // upon connection only to user
    socket.emit("message", buildMsg(ADMIN, "welcome to chat room"))

    socket.on("enterRoom", (data) => {
        const { name, room } = data;

        const prevRoom = getUser(socket.id)[0]?.room

        if (prevRoom) {
            socket.leave(prevRoom);
            io.to(prevRoom).emit("message", buildMsg(ADMIN, `${name} had leaved the room`))
        }

        const user = activateUser(socket.id, name, room)

        // can not update the previous room data, until state uupdate in activateUser
        if (prevRoom) {
            socket.to(prevRoom).emit('userlist', {
                users: getUserInRoom(prevRoom)
            })
        }

        // Join new room
        socket.join(user.room)

        // To user who had join
        socket.to(user.room).emit('message', buildMsg(ADMIN, `you had just joined ${user.room} room`))

        // To other user of the room
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} just joined ${user.room} room`))

        // update user list in room who had just joined
        io.to(user.room).emit('userlist', {
            users: getUserInRoom(user.room)
        })

        // update rooms list for everyone
        io.emit('roomList', {
            rooms: getAllActiveRoom()
        })
    })

    // upon connection only to other users
    // socket.broadcast.emit("message", `${socket.id.substring(0, 5)} is connected`)

    // lisning to "message" event
    socket.on("message", ({ name, message }) => {
        const user = getUser(socket.id)[0]
        if (user) {
            io.to(user.room).emit("message", buildMsg(name, message))
        }
    })

    // lisning to disconnect event.
    socket.on('disconnect', (data) => {
        const user = getUser(socket.id)[0]
        userLeaveApp(socket.id)
        if (user) {
            socket.broadcast.to(user.room).emit("message", buildMsg(ADMIN, `${user.name} is disconnected`))

            io.to(user.room).emit('roomList', {
                rooms: getAllActiveRoom()
            })

            io.to(user.room).emit('userlist', {
                users: getUserInRoom(user.room)
            })
        }
    })

    socket.on("activity", (name) => {
        const room = getUser(socket.id)[0]?.room
        if (room) {
            socket.broadcast.to(room).emit("typing", `${name} is typing....`)
        }
    })
})

const buildMsg = (name, message) => {
    return {
        name: name,
        message: message,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

function activateUser(id, name, room) {
    const user = { id, name, room }
    // console.log({ user })
    userState.setUsers([...userState.users.filter(user => user.id !== id), user])
    return user
}

function userLeaveApp(id) {
    userState.setUsers([...userState.users.filter(user => user.id != id)])
}

function getUser(id) {
    return userState.users.filter(user => user.id === id)
}

function getUserInRoom(room) {
    return userState.users.filter(user => user.room === room);
}

function getAllActiveRoom(room) {
    return Array.from(new Set(userState.users.map(user => user.room)))
}

