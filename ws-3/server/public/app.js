// const socket = new WebSocket('ws://localhost:3000')
const socket = io('ws://localhost:3501')

const input = document.querySelector('input')

function sendMessage(event) {
    event.preventDefault();
    const msg = input.value
    if (msg) {
        socket.emit("message", msg)
        input.value = ""
    }
    input.focus()
}

const typingbox = document.querySelector('.activitybox')


document.querySelector('form').addEventListener('submit', sendMessage);

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
    const listItem = document.createElement('li');
    listItem.textContent = data;
    document.querySelector('ul').appendChild(listItem);
})

// Capture keypress event and trigger event
input.addEventListener("keypress", () => {
    socket.emit("activity", `${socket?.id?.substring(0, 5)} is typing`)
});

