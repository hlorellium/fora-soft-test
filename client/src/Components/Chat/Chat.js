import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';



const Chat = ({  roomId, messages, message, setMessage, sendMessage }) => {

    return (
        <div className="chat">
            <div className="chatBar">
                <p className="roomId">{roomId}</p>
                <a className="leaveBtn" href="/">
                    &times;
                </a>
            </div>

            <ScrollToBottom className="messages">
                {messages.map((message, i) => (
                    <div key={i} className="message">
                      <p className="messageUser">{message.user}</p>
                        <p className="messageText">{message.text}</p>
                      <p className="messageTime">{message.sentAt}</p>
                    </div>
                ))}
            </ScrollToBottom>

            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Write a message..."
                    autoFocus
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) =>
                        e.key === 'Enter' ? sendMessage(e) : null
                    }
                />
                <button className="sendBtn" onClick={(e) => sendMessage(e)}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
