const socket = io();

var username;

var chats = document.querySelector(".chats");
var users_list = document.querySelector(".users-list");
var users_count = document.querySelector(".users-count");
var msg_send = document.querySelector("#msg-send");
var user_msg = document.querySelector("#user-msg");

do {
    username = prompt("Enter your name to join:");
} while (!username);

//will call when user joined
socket.emit("new-user-joined", username);

//notify that user joined
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

//function to create joined/left status div
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('users-join');
    let content = `<p><b>${name} </b>${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

//notify that user left
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left');
})

//to update users list and user count
socket.on('user-list', (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for (i = 0; i < users_arr.length; i++){
        let p = document.createElement('p');
        p.innerHTML = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
})

//for sending message
msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if (user_msg.value != '') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        user_msg.value = '';
    }
});
function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}
socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})