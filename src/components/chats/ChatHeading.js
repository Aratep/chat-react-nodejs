import React from 'react';
import FAVideo from 'react-icons/lib/fa/video-camera'
import FAUserPlus from 'react-icons/lib/fa/user-plus'
import MdEllipsisMenu from 'react-icons/lib/md/keyboard-control'
import MdEject from 'react-icons/lib/md/eject'

export default function ({name, numberOfUsers, logout}) {
    return (
        <div className="chat-header">
            <div className="user-info">
                <div className="user-name">{name}</div>
                <div className="status">
                    <div className="indicator"/>
                </div>
            </div>
            <div className="options">
                <FAVideo/>
                <FAUserPlus/>
                <MdEllipsisMenu/>
                <div onClick={()=>{logout()}} title="Logout" className="logout">
                    <MdEject/>
                </div>
            </div>
        </div>
    );

}
