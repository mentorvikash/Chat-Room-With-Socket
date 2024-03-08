const socket = new WebSocket('ws://localhost:3000')

function sendMessage(event) {
    event.preventDefault();

    const input = document.querySelector('input')
    const msg = input.value
    if (msg) {
        socket.send(msg)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage);

// listen to message
socket.addEventListener('message', ({ data }) => {
    const listItem = document.createElement('li');
    listItem.textContent = data;
    document.querySelector('ul').appendChild(listItem);
})
