
const socket = io();
//get URL query params
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
socket.on('message', outputMessage);
//user should be able to submit form upon hitting enter
document.getElementById("msg").addEventListener("keypress", submitOnEnter);

socket.on('roomUsers',outputRoomUsers);
const chatForm = document.getElementById("chat-form");
chatForm.addEventListener('submit', sendText);
const userData = {username: params.username,
                  room: params.room  };

//update romName from query params
document.getElementById("room-name").innerText = params.room;
socket.emit('joinRoom',userData);

function sendText(event) {
    event.preventDefault();
    const msg = chatForm.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage', msg);
    // clear msg after user sends
    chatForm.elements.msg.value = '';
}

function outputRoomUsers(data){
    var userList = document.getElementById("users");
    
    userList.innerHTML = createUserHTMLList(data);
}
function submitOnEnter(event){
    if(event.which === 13 && !event.shiftKey){
        event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
        event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
    }
}
function createUserHTMLList(data){
    console.log(data);
    var UserHTML = ``;
    data.forEach(element => {
        var li = `<li>${element.username}</li>`
        UserHTML += li;
    });
    console.log(UserHTML);
    return UserHTML;
}


function outputMessage(data) {
    
    var chatMsg = document.getElementById("chat-messages");

    var newChatMsgContent = `<p class="meta">${data.username} <span>${data.time}</span></p>
    <p class="text">
        ${data.text}
    </p>`
    var newChatMsg = document.createElement('div');
    //if the user im rendering , is the current user sending message
    if(userData.username == data.username){
        newChatMsg.className = "userInitiatemessage";
    }
    else{
        newChatMsg.className = "message";
    }
    
    newChatMsg.innerHTML = newChatMsgContent;
    chatMsg.appendChild(newChatMsg);
    //Scroll down automatically
    chatMsg.scrollTop = chatMsg.scrollHeight;
}
