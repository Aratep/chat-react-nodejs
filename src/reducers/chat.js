import {CHAT} from '../lib/constants'

const chat = (state = [], action) => {
    switch (action.type) {
        case CHAT:
            return {...state,  chats: action.chats, activeChat: action.activeChat};
        default:
            return state
    }
}

export default chat

// import {TEST} from '../lib/constants'
//
// const test = (state = [], action) => {
//     switch (action.type) {
//         case TEST:
//             return {...state,  chat: action.chat};
//         default:
//             return state
//     }
// }
//
// export default test