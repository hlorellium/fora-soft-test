import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Chat from '../Chat/Chat';
import './Room.css';
import Peer from 'peerjs';

let socket;
const Room = ({ name }) => {
    const { roomId } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [streams, setStreams] = useState([]);
    const ENDPOINT = 'localhost:5000';

    const videoGrid = useRef();

    useEffect(() => {
        const peers = {};
        socket = io(ENDPOINT);
        const myPeer = new Peer(undefined, {
            host: '/',
            port: '3001',
        });

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                stream.owner = 'My video';
                setStreams((streams) => [...streams, stream]);
                myPeer.on('call', (call) => {
                    let streamed = false;
                    console.log('call');
                    call.answer(stream);
                    call.on('stream', (userVideoStream) => {
                        console.log('stream');
                        !streamed &&
                            setStreams((streams) => [
                                ...streams,
                                userVideoStream,
                            ]);
                        streamed = true;
                    });
                    streamed = false;
                });

                socket.on('user-connected', (peerId) => {
                    console.log('user connected');
                    connectToNewUser(peerId, stream);
                });
            });

        socket.on('user-disconnected', (peerId) => {
            console.log('user disconnected');
            peers[peerId] && peers[peerId].close();
        });

        myPeer.on('open', (peerId) => {
            socket.emit('join-room', { name, roomId, peerId }, (error) => {
                if (error) alert(error);
            });
        });

        const connectToNewUser = (peerId, stream) => {
            console.log('connect to new user', peerId, stream);
            const call = myPeer.call(peerId, stream);
            let streamed = false;
            call.on('stream', (userVideoStream) => {
                console.log('on stream');
                !streamed &&
                    setStreams((streams) => [...streams, userVideoStream]);
                streamed = true;
            });

            call.on('close', () => {
                console.log(stream);
                setStreams((streams) =>
                    streams.filter((Stream) => Stream !== stream)
                );
                streamed = false;
            });

            peers[peerId] = call;
        };
        return () => {
            socket.emit('disconnect');

            socket.off();
        };
    }, [ENDPOINT, name, roomId]);

    // Messaging
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((messages) => [...messages, message]);
        });
        // Get all users
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) socket.emit('send-message', message, () => setMessage(''));
    };
    console.log(streams);
    return (
        <div className="wrapper">
            <div className="video-grid" ref={videoGrid}>
                {streams.map((stream, index) => (
                    <Video key={index} stream={stream} />
                ))}
            </div>
            <div className="chatWrapper">
                <div className="users">
                    <p>Users in room:</p>
                    {users.map((user) => (
                        <p className="userName">{user.name}</p>
                    ))}
                </div>
                <Chat
                  roomId={roomId}
                  name={name}
                  sendMessage={sendMessage}
                  messages={messages}
                  setMessage={setMessage}
                  message={message}
                />
            </div>
        </div>
    );
};

const Video = ({ stream }) => {
    const ref = useRef();
    useEffect(() => {
        if (stream.owner) ref.current.muted = true;
        ref.current.srcObject = stream;
    }, []);
    return <video playsInline autoPlay ref={ref} />;
};

export default Room;
