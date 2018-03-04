import React, {Component} from 'react';
import {connect} from 'react-redux'

import {COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING} from '../../lib/Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import {setChat} from '../../actions/index'

class ChatComponent extends Component {
    componentDidMount() {
        const {socket} = this.props;
        socket.emit(COMMUNITY_CHAT, this.resetChat)
    }

    resetChat = (chat) => {
        return this.addChat(chat, true)
    }

    addChat = (chat, reset) => {
        const {socket, dispatch} = this.props;
        const chats = this.props.chat.chats;
        const activeChat = reset ? chat : this.props.chat.activeChat;

        const newChats = reset ? [chat] : [...chats, chat]
        dispatch(setChat(newChats, activeChat))

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    addMessageToChat = (chatId) => {
        const {dispatch, chat} = this.props;
        const activeChat = chat.activeChat;
        const chats = chat.chats;

        return message => {
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })

            dispatch(setChat(newChats, activeChat))
        }
    }

    updateTypingInChat = (chatId) => {
        const {dispatch, chat} = this.props;
        const activeChat = chat.activeChat;
        const chats = chat.chats;

        return ({isTyping, user}) => {
            if (user !== this.props.user.name) {

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
                dispatch(setChat(newChats, activeChat))
            }
        }
    }

    sendMessage = (chatId, message) => {
        const {socket} = this.props;
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    sendTyping = (chatId, isTyping) => {
        const {socket} = this.props;
        socket.emit(TYPING, {chatId, isTyping})
    }

    render() {
        const {user, logout, chat} = this.props;
        const {activeChat} = chat;

        return (
            <div className="container">

                <div className="chat-room-container">
                    {
                        activeChat !== undefined ? (

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
    chat: state.chat,
});

const ChatContainer = connect(
    mapStateToProps
)(ChatComponent);

export default ChatContainer;
