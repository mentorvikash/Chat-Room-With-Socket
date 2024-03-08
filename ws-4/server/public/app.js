// const socket = new WebSocket('ws://localhost:3000')
const socket = io('ws://localhost:3500')

// form
const messageRoomform = document.querySelector('#message-room');
const chatRoomform = document.querySelector('#chat-room')

// input
const chatMsg = document.querySelector('#chat-input')
const chatname = document.querySelector('#user-name')
const chatroom = document.querySelector('#room-name')
const chatbox = document.querySelector('.chat-box')
const userlist = document.querySelector('#user-list')
const roomlist = document.querySelector('#room-list')
const typingbox = document.querySelector('.activitybox')

messageRoomform.addEventListener('submit', sendMessage)
chatRoomform.addEventListener('submit', joinChatRoom);
// capture keypress
chatMsg.addEventListener("keypress", () => {
    const name = chatname?.value;
    socket.emit("activity", name)
});

function sendMessage(event) {
    event.preventDefault();
    const message = chatMsg?.value;
    const name = chatname?.value
    if (message && name) {
        const data = {
            name,
            message
        }
        socket.emit("message", data)
        chatMsg.value = ""
    }
    chatMsg.focus()
}

function joinChatRoom(event) {
    event.preventDefault();
    const name = chatname?.value;
    const room = chatroom?.value
    if (name && room) {
        const data = {
            name,
            room
        }

        console.log({ data })

        socket.emit('enterRoom', data)
    }
    console.log("we are ready to join chat room", event.target)
}

let activityTimer;
socket.on('typing', (data) => {
    typingbox.textContent = data;
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        typingbox.textContent = "";
    }, 3000);
})

socket.on('message', (data) => {
    typingbox.textContent = "";
    const { name, message, time } = data;
    const listItem = document.createElement('li');
    listItem.className = `target-message`
    // listItem.textContent = `${name} : ${message} at ${time} `;
    listItem.innerHTML = `
    <div class="name">
    <span>${name}</span>
  </div>
  <div class="message-box">
    <span class="message-block">${message}</span>
    <span class="time-block">${time}</span>
    </div>
    `
    // listItem.textContent = "let add this new li";
    chatbox.appendChild(listItem);
})

socket.on('userlist', ({ users }) => {
    console.log('userlist', users);
    if (users.length) {
        userlist.innerHTML = "";
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${user.name}</span>`
            userlist.appendChild(listItem);
        })
    }
})

socket.on('roomList', ({ rooms }) => {
    if (rooms.length) {
        roomlist.innerHTML = "";
        rooms.forEach(room => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${room}</span>`
            roomlist.appendChild(listItem);
        })
    }
})
