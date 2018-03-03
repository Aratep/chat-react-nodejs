import React, {Component} from 'react';
import {connect} from 'react-redux'

import {COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING} from '../../lib/Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import {setChat} from '../../actions/index'

class ChatComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [],
            activeChat: null
        };
    }

    componentDidMount() {
        const {socket} = this.props
        socket.emit(COMMUNITY_CHAT, this.resetChat)
    }

    resetChat = (chat) => {
        return this.addChat(chat, true)
    }

    addChat = (chat, reset) => {
        const {chats} = this.state;
        const {socket, dispatch} = this.props;
        const activeChat = reset ? chat : this.state.activeChat;

        const newChats = reset ? [chat] : [...chats, chat]
        this.setState({chats: newChats, activeChat: activeChat});
        dispatch(setChat(newChats, activeChat))

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    addMessageToChat = (chatId) => {
        const { dispatch} = this.props;
        return message => {
            const {chats} = this.state
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            // console.log(newChats)

            this.setState({chats: newChats})
            dispatch(setChat(newChats, this.state.activeChat))
        }
    }

    updateTypingInChat = (chatId) => {
        const { dispatch } = this.props;

        return ({isTyping, user}) => {
            if (user !== this.props.user.name) {

                const {chats} = this.state

                let newChats = chats.map((chat) => {
                    if (chat.id === chatId) {
                        if (isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user)
                        } else if (!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                        }
                    }
                    return chat
                })
                this.setState({chats: newChats})
                dispatch(setChat(newChats, this.state.activeChat))
            }
        }
    }

    sendMessage = (chatId, message) => {
        const {socket} = this.props
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    sendTyping = (chatId, isTyping) => {
        const {socket} = this.props
        socket.emit(TYPING, {chatId, isTyping})
    }

    render() {
        const {user, logout} = this.props
        const {activeChat} = this.state
        console.log(this.props)

        return (
            <div className="container">

                <div className="chat-room-container">
                    {
                        activeChat !== null ? (

                                <div className="chat-room">
                                    <ChatHeading name={activeChat.name} logout={logout}/>
                                    <Messages
                                        messages={activeChat.messages}
                                        user={user}
                                        typingUsers={activeChat.typingUsers}
                                    />
                                    <MessageInput
                                        sendMessage={
                                            (message) => {
                                                this.sendMessage(activeChat.id, message)
                                            }
                                        }
                                        sendTyping={
                                            (isTyping) => {
                                                this.sendTyping(activeChat.id, isTyping)
                                            }
                                        }
                                    />

                                </div>
                            ) :
                            <div className="chat-room choose">
                                <h3>Choose a chat!</h3>
                            </div>
                    }
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    chats: state.chats,
    activeChat: state.activeChat
});

const ChatContainer = connect(
    mapStateToProps
)(ChatComponent)

export default ChatContainer;
