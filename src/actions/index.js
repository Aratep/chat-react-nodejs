import {USER, NICKNAME, CHAT} from '../lib/constants'

export const setUserAction = (user) => {
    return {
        type: USER,
        user
    }
};

export const setNickName = (nickname) => {
    return {
        type: NICKNAME,
        nickname
    }
}

export const setChat = (chats, activeChat) => {
    return {
        type: CHAT,
        chats,
        activeChat
    }
}

