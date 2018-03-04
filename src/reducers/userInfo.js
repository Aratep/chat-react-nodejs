import {INFO} from '../lib/constants'

const userInfo = (state = [], action) => {
    switch (action.type) {
        case INFO:
            return {
                ...state,
                socket: action.socket,
                user: action.user,
                connectedUsersCount: action.connectedUsersCount,
                visitTime: action.visitTime,
            };
        default:
            return state
    }
}

export default userInfo