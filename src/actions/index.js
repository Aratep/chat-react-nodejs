import {INFO, NICKNAME, CHAT} from '../lib/constants'

export const setNickName = (nickname) => {
    return {
        type: NICKNAME,
        nickname
    }
}

export const userInfoAction = (socket, user, connectedUsersCount, visitTime) => {
    return {
        type: INFO,
        socket,
        user,
        connectedUsersCount,
        visitTime
    }
}

export const setChat = (chats, activeChat) => {
    return {
        type: CHAT,
        chats,
        activeChat
    }
}
