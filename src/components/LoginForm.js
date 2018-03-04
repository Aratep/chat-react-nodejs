import React, {Component} from 'react';
import {connect} from "react-redux";

import {setNickName} from '../actions/index'
import {VERIFY_USER} from '../lib/Events'

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ""
        };
    }

    setUser = ({user, isUser}) => {

        if (isUser) {
            this.setError("User name taken")
        } else {
            this.setError("")
            this.props.setUser(user)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const {socket, nickname} = this.props
        socket.emit(VERIFY_USER, nickname.nickname, this.setUser)
    }

    handleChange = (e) => {
        const {dispatch} = this.props;
        dispatch(setNickName(e.target.value));
    }

    setError = (error) => {
        this.setState({error})
    }

    render() {
        const { error} = this.state;
        const {nickname} = this.props.nickname;
        // console.log(this.props)

        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">

                    <label htmlFor="nickname">
                        <h2>Enter Your Nickname</h2>
                    </label>
                    <input
                        ref={(input) => {
                            this.textInput = input
                        }}
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'MY Cool Nickname'}
                    />
                    <div className="error">{error ? error : null}</div>

                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    nickname: state.nickname
});

const LoginFormContainer = connect(
    mapStateToProps
)(LoginForm)

export default LoginFormContainer;
