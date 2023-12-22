import { useEffect, useRef, useState } from 'react';
import axios from '../../../instances/axios';
import styles from './Chat.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';
import { socket } from '../../../instances/socket';
import { Message } from '../../../instances/interfaces';
import { useSelector } from 'react-redux';
import { getUsername } from '../../../redux/actions/usernameActions';
import Swal from 'sweetalert2';
import VideoCall from '../videoCall/VideoCall';

interface Props {
    setMessageKey: React.Dispatch<React.SetStateAction<string>>
}

export default function Chat({setMessageKey}: Props) {
    const navigate = useNavigate();
    const {username} = useParams();
    const chatRef = useRef<HTMLDivElement>(null);
    const myUsername = useSelector(getUsername);

    const [profile, setProfile] = useState<ProfileInterface>();
    const [chat, setChat] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [inVideoCall, setInVideoCall] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const socketConnected = socket.connected;

    useEffect(() => {
        if (!myUsername || !username || !socketConnected) return;
        function onReceiveMessage(message: Message) {
            setChat((prev) => [...prev, message]);
            setMessageKey(Date.now().toString()+'msg');
        }
        function onReceiveChatId(id: string) {
            setChatId(id);
        }
        function onTyping(flag: boolean) {
            setIsTyping(flag);
        }

        socket.emit('joinChat', myUsername+username);
        socket.on('receiveMessage', onReceiveMessage);
        socket.on('receiveChatId', onReceiveChatId);
        socket.on('isTyping', onTyping);

        return () => {
            socket.off('receiveMessage', onReceiveMessage);
            socket.off('receiveChatId', onReceiveChatId);
            socket.off('onTyping', onTyping);
            socket.emit('leaveChat', myUsername+username);
        }
    }, [myUsername, username, socketConnected, setMessageKey]);

    useEffect(() => {
        function callEnd(from: string) {
            if (inVideoCall === from) {
                setInVideoCall(null);
                Swal.fire({
                    text: 'Call Ended',
                    backdrop: true,
                    background: 'black',
                    iconHtml: `<i class="fa-solid fa-phone"></i>`,
                    showConfirmButton: true,
                    allowOutsideClick: true,
                });
            }
        }
        if (inVideoCall) {
            socket.on('receiveEndCall', callEnd);
        } else socket.off('receiveEndCall', callEnd);

    }, [inVideoCall]);

    const doVideoCall = () => {
        if (!username || !myUsername || !socketConnected) return;
        function onReceiveVideoCallRejection(from: string) {
            socket.off('receiveVideoCallRejection', onReceiveVideoCallRejection);
            Swal.fire({
                title: `${from}`,
                text: 'Call rejected',
                backdrop: true,
                background: 'black',
                iconHtml: `<i class="fa-solid fa-phone"></i>`,
                showConfirmButton: true,
                allowOutsideClick: true,
            });
        }

        function onReceiveVideoCallAcceptance(from: string) {
            if (from !== username) return;
            socket.off('receiveVideoCallAcceptance', onReceiveVideoCallAcceptance);
            Swal.close();
            setInVideoCall(username);
        }

        socket.emit('requestVideoCall', {from: myUsername, to: username});
        socket.on('receiveVideoCallRejection', onReceiveVideoCallRejection);
        socket.on('receiveVideoCallAcceptance', onReceiveVideoCallAcceptance);
        Swal.fire({
            title: `${username}`,
            backdrop: true,
            background: 'black',
            text: 'Video calling',
            iconHtml: `<i class="fa-solid fa-phone fa-beat-fade"></i>`,
            iconColor: 'yellowgreen',
            showCancelButton: true,
            cancelButtonText: 'End',
            cancelButtonColor: 'orangered',
            showConfirmButton: false,
            allowOutsideClick: false,
        }).then(response => {
            if (!response.isConfirmed) {
                socket.off('receiveVideoCallRejection', onReceiveVideoCallRejection);
                socket.emit('sendStopCall', {from: myUsername, to: username});
            }
        });
    }

    const handleSendMessage = () => {
        if (!myUsername || !profile) return;
        if (inputMessage.trim() === '' || !socketConnected) return;
        const message = {
            sender: myUsername,
            message: inputMessage,
            type: 'text',
            timestamp: new Date(),
            status: 'send',
        };
        socket.emit('sendMessage', {message, to: username, chatId});
        setInputMessage('');
        setChat([...chat, message]);
        setMessageKey(Date.now().toString()+'msg');
    }

    useEffect(() => {
        if (inputMessage.length !== 0) {
            socket.emit('typing', {username, me: myUsername, flag: true});
        } else if (inputMessage.length === 0) socket.emit('typing', {username, me: myUsername, flag: false});
    }, [inputMessage, username, myUsername]);


    useEffect(() => {
        if (!username) return;
        axios.get(`/user/get-chat/${username}`)
        .then(response => {
            if (response.status === 200) {
                setChat(response.data?.chat);
                setProfile(response.data?.profile);
                setChat(response.data?.chat);
                setChatId(response.data?.chatId ?? null);
            }
        }).catch(() => {
            alert("Internal server error");
            navigate("/app");
        })
    }, [username, navigate]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat, isTyping]);

    const formatTime = (timestamp: Date) => {
        timestamp = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(timestamp);
    };

    if (!username || !profile || !myUsername) return null;
    return (
        <>
        {inVideoCall !== null && <VideoCall username={username} myUsername={myUsername} setInVideoCall={setInVideoCall} />}
        <div ref={chatRef} className={styles.chat}>
            <div className={styles['wrap-content']}>
                {profile !== undefined &&
                <div className={styles.profile}>
                    <div onClick={() => navigate('/app/view-profile/'+username)} className={styles['profile-pic']}>
                        <img src={`${ApiUrl}/media/${profile.profile?.medias[0]}`} />
                    </div>
                    <span onClick={() => navigate('/app/view-profile/'+username)}>{profile.firstname + ' ' + profile.lastname}</span>
                    
                    <p>Be cautious about sharing personal info or photos with strangers. Keep things fun and safe! <i className="fa-solid fa-triangle-exclamation"></i> </p>
                </div>
                }
                {chat &&
                <div className={styles.msg}>
                    {chat.map((msg) => {
                        return (
                            <p className={`${msg.sender !== username ? styles.send : ''}`} key={msg.timestamp.toString()}>
                                {msg.message}
                                <span className={styles.time}>{formatTime(msg.timestamp)}</span>
                            </p>
                        )
                    })}
                    {isTyping === true && <div className={styles.typing}><i className="fa-solid fa-ellipsis fa-beat-fade"></i></div>}
                </div>
                }
            </div>
            <div className={styles.topbar}>
                <i onClick={() => window.innerWidth <= 768 ? navigate('/app/messages') : navigate('/app')} className={`fa-solid fa-circle-arrow-left ${styles['back-click']}`}></i>
                <div>
                    <i onClick={() => doVideoCall()} className="fa-solid fa-video"></i>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div className={styles.typebox}>
                <i className="fa-solid fa-image"></i>
                <textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder='Type here...' rows={1}></textarea>
                <span onClick={handleSendMessage}>Send</span>
            </div>
        </div>
        </>
    )
}