// const socket = new WebSocket('ws://localhost:3000')
const socket = io('ws://localhost:3500')

function sendMessage(event) {
    event.preventDefault();

    const input = document.querySelector('input')
    const msg = input.value
    if (msg) {
        socket.emit("message", msg)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage);

// listen to message
// socket.addEventListener('message', ({ data }) => {
//     const listItem = document.createElement('li');
//     listItem.textContent = data;
//     document.querySelector('ul').appendChild(listItem);
// })

socket.on('message', (data) => {
    const listItem = document.createElement('li');
    listItem.textContent = data;
    document.querySelector('ul').appendChild(listItem);
})
