import React, {Component} from 'react';
import io from 'socket.io-client'
import {connect} from "react-redux";

import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import {SOCKETURL} from '../lib/constants'
import {USER_CONNECTED, LOGOUT, USER_INFO} from '../lib/Events'
import {userInfoAction} from '../actions/index'

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
        const socket = io(SOCKETURL);
        const {dispatch, user, connectedUsersCount, visitTime} = this.props;

        socket.on('connect', () => {
            console.log("Connected");
        })

        this.setState({socket})
        dispatch(userInfoAction(socket, user, connectedUsersCount, visitTime))
    }

    setUser = (user) => {
        const {socket} = this.state;
        const {dispatch} = this.props;

        socket.emit(USER_CONNECTED, user);
        socket.on(USER_INFO, (info) => {
            const {visitTime, connectedUsersCount} = info;
            this.setState({connectedUsersCount, visitTime})
            dispatch(userInfoAction(socket, user, connectedUsersCount, visitTime))
        })
        this.setState({user})
    }

    logout = () => {
        const {socket} = this.state;
        const {dispatch, connectedUsersCount, visitTime} = this.props;

        socket.emit(LOGOUT)
        this.setState({user: null})
        dispatch(userInfoAction(socket, null, connectedUsersCount, visitTime))

    }


    render() {
        const {socket, user, connectedUsersCount, visitTime} = this.props.userInfo;
        // console.log(this.props.userInfo);

        if(user !== undefined && socket !== undefined && connectedUsersCount !== undefined && visitTime !== undefined) {
            console.log(`user id ------------  ${user.id}`);
            console.log(`user visit time ----- ${visitTime}`);
            console.log(`user name ----------  ${user.name}`);
            console.log(`connected users count ${connectedUsersCount}`)
        }

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

const mapStateToProps = (state) => ({
    userInfo: state.userInfo,
});

const LayoutContainer = connect(
    mapStateToProps
)(Layout)
export default LayoutContainer;
