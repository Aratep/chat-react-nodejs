import {createStore, combineReducers} from 'redux';

import userInfo from './reducers/userInfo';
import nickname from './reducers/nickname';
import chat from './reducers/chat';

const rootReducer = combineReducers({
    userInfo,
    nickname,
    chat,
});

const REDUX_DEVTOOLS = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, REDUX_DEVTOOLS);

export default store