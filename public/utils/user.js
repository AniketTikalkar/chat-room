//keep track of users state
const users = [];

//join user to chat
function userJoin(id,username,room){
    const user = {
        id : id,
        username : username,
        room: room
    };
    users.push(user);
    return user;
}

function getUserByID(id){
    return users.find(user => user.id == id);
}
//get user that left and also remove it from the users array
function removeUser(id){
    const ind = users.findIndex(usr => usr.id == id);
    //if user to remove is found
    if(ind != -1){
        //this will remove it from users list and will also return the removed user simultaneously
        return users.splice(ind,1)[0];
    }
}

function getUsersInRoom(room){
   return users.filter(usr => usr.room == room);
}

module.exports = {
    userJoin,
    getUserByID,
    removeUser,
    getUsersInRoom
}