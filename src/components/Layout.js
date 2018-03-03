import React, {Component} from 'react';
import io from 'socket.io-client'

import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import {SOCKETURL} from '../lib/constants'
import {USER_CONNECTED, LOGOUT, USER_INFO} from '../lib/Events'

class Layout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            user: null,
            connectedUsersCount: null,
            visitTime: null
        };
    }

    componentWillMount() {
        this.initSocket()
    }

    initSocket = () => {
        const socket = io(SOCKETURL)

        socket.on('connect', () => {
            console.log("Connected");
        })

        this.setState({socket})
    }

    setUser = (user) => {
        const {socket} = this.state;

        socket.emit(USER_CONNECTED, user);
        socket.on(USER_INFO, (info) => {
            const {visitTime, connectedUsersCount} = info;
            this.setState({connectedUsersCount, visitTime})
        })
        this.setState({user})
    }

    logout = () => {
        const {socket} = this.state;

        socket.emit(LOGOUT)
        this.setState({user: null})

    }


    render() {
        const {socket, user, connectedUsersCount, visitTime} = this.state;

        if(user !== null && connectedUsersCount !== null && visitTime !== null) {
            console.log(`user id ------------  ${user.id}`)
            console.log(`user visit time ----- ${visitTime}`)
            console.log(`user name ----------  ${user.name}`)
            console.log(`connected users count ${connectedUsersCount}`)
        }
        // console.log(user)
        return (
            <div className="container">
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser}/>
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout}/>
                }
            </div>
        );
    }
}
export default Layout;
