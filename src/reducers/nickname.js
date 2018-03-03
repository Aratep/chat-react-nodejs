import {NICKNAME} from '../lib/constants'

const nickname = (state = [], action) => {
    switch (action.type) {
        case NICKNAME:
            return {...state,  nickname: action.nickname};
        default:
            return state
    }
}

export default nickname