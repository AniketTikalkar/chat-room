//entry to backend
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3100;
const socketio = require('socket.io')
const userFunctions = require('./public/utils/user');
const msgFunctions = require('./public/utils/messages');
//required to create socket server
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);
//set static folder, this will be seen by clients
//by default, express finds the index.html in the root directory given in static function to display to clients
app.use(express.static(path.join(__dirname,'public')));
// app.listen(PORT, () => {
//     console.log(` app listening at http://localhost:${PORT}`);
//     console.log(path.join(__dirname,'public'));
//   })

const SERVER_NAME = "Chatroom Server";
//run when client connects
io.on('connection',newConnection);
server.listen(PORT, () => {
  console.log(` app listening at http://localhost:${PORT}`);
  console.log(path.join(__dirname,'public'));
})

function newConnection(socket){
  console.log("new Connection: " + socket.id);
  
  //join room, socket io has join functionality to provide group
  socket.on('joinRoom',({username,room}) => {
    const user = userFunctions.userJoin(socket.id,username,room);
    socket.join(user.room);
    //welcome new connection
  socket.emit('message',msgFunctions.formatMessage(SERVER_NAME,"Welcome to the chat"))
    //broadcast to everyone except the user
  socket.broadcast.to(user.room).emit('message',msgFunctions.formatMessage(SERVER_NAME,`${username} has joined the room`));
  io.to(room).emit('roomUsers',userFunctions.getUsersInRoom(room));
  })
  
  //notify everyone that user got disconnected
  socket.on('disconnect',()=>{
    const userToRemove = userFunctions.removeUser(socket.id)
    if(userToRemove != null && userToRemove != undefined){
      io.to(userToRemove.room).emit('message',msgFunctions.formatMessage(SERVER_NAME,`${userToRemove.username} has left the chat`));
      //emit event to manipulate dom
      io.to(userToRemove.room).emit('roomUsers',userFunctions.getUsersInRoom(userToRemove.room));
    }
    
  });
  //Listen for chatMessage
  socket.on('chatMessage',(msg)=>{
    const user = userFunctions.getUserByID(socket.id);
    io.to(user.room).emit('message',msgFunctions.formatMessage(user.username,msg));
  })
}