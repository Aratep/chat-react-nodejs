const io = require('./index').io;
const {
    VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
    LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
    TYPING, USER_INFO
} = require('../lib/Events');
const {createUser, createMessage, createChat} = require('../lib/Factories');

let connectedUsers = {};
let communityChat = createChat();

module.exports = function (socket) {

    console.log("Socket Id:" + socket.id);

    let sendMessageToChatFromUser;

    let sendTypingFromUser;

    //Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        // console.log(Date.now())
        if (isUser(connectedUsers, nickname)) {
            callback({isUser: true, user: null, loginDate: null})
        } else {
            callback({isUser: false, user: createUser({name: nickname}), loginDate: Date.now()})
        }
    })

    //User Connects with username
    socket.on(USER_CONNECTED, (user) => {
        let connectedUsersCount = 0;
        let visitTime = new Date();

        connectedUsers = addUser(connectedUsers, user)
        socket.user = user

        sendMessageToChatFromUser = sendMessageToChat(user.name)
        sendTypingFromUser = sendTypingToChat(user.name)

        io.emit(USER_CONNECTED, connectedUsers)
        console.log(connectedUsers);

        //count connected users
        for (let property in connectedUsers) {
            if (Object.prototype.hasOwnProperty.call(connectedUsers, property)) {
                connectedUsersCount++;
            }
        }
        io.emit(USER_INFO, {connectedUsersCount, visitTime})

    })

    //User disconnects
    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name)

            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log("Disconnect", connectedUsers);
        }
    })


    //User logsout
    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(USER_DISCONNECTED, connectedUsers)
        console.log("Disconnect", connectedUsers);

    })

    //Get Community Chat
    socket.on(COMMUNITY_CHAT, (callback) => {
        callback(communityChat)
    })

    socket.on(MESSAGE_SENT, ({chatId, message}) => {
        sendMessageToChatFromUser(chatId, message)
    })

    socket.on(TYPING, ({chatId, isTyping}) => {
        sendTypingFromUser(chatId, isTyping)
    })

}

function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, {user, isTyping})
    }
}

function sendMessageToChat(sender) {
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
    }
}

function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}

function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}

function isUser(userList, username) {
    return username in userList
}

