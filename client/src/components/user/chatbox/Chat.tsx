import { useEffect, useRef, useState } from 'react';
import axios from '../../../instances/axios';
import styles from './Chat.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileInterface } from '../../../instances/interfaces';
import accountIcon from '../../../assets/images/account-icon.png';
import { socket } from '../../../instances/socket';
import { Message } from '../../../instances/interfaces';
import { useSelector } from 'react-redux';
import { getUsername } from '../../../redux/actions/usernameActions';
import Swal from 'sweetalert2';
import VideoCall from '../videoCall/VideoCall';
import Report from '../report/Report';

interface Props {
    setMessageKey: React.Dispatch<React.SetStateAction<string>>
}

export default function Chat({setMessageKey}: Props) {
    const navigate = useNavigate();
    const {username} = useParams();
    const chatRef = useRef<HTMLDivElement>(null);
    const myUsername = useSelector(getUsername);
    const [inReport, setInReport] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null)

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
        function onReceiveUnsend(timestamp: Date) {
            console.log(timestamp)
            const newChat = [...chat].filter((msg) => msg.timestamp !== timestamp);
            setChat(newChat);
        }
        function onReceiveChatId(id: string) {
            setChatId(id);
        }
        function onTyping(flag: boolean) {
            setIsTyping(flag);
        }

        socket.emit('joinChat', myUsername+username);
        socket.on('receiveMessage', onReceiveMessage);
        socket.on('receiveUnsend', onReceiveUnsend);
        socket.on('receiveChatId', onReceiveChatId);
        socket.on('isTyping', onTyping);

        return () => {
            socket.off('receiveMessage', onReceiveMessage);
            socket.off('receiveUnsend', onReceiveUnsend);
            socket.off('receiveChatId', onReceiveChatId);
            socket.off('onTyping', onTyping);
            socket.emit('leaveChat', myUsername+username);
        }
    }, [myUsername, username, socketConnected, setMessageKey, chat]);

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
        if (inputRef.current) {
            inputRef.current.focus();
        }
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

    const handleUnsend = (msg: Message, index: number) => {
        if (msg.sender === username || !chatId) return;
        Swal.fire({
            text: `Unsend message?`,
            footer: msg.message.slice(0, 30)+'...' ?? msg.message.slice(0),
            backdrop: true,
            background: 'black',
            showCancelButton: true,
            focusCancel: true,
            width: innerWidth <= 768 ? '85%' : '30%',
        }).then((res) => {
            if (res.isConfirmed) {
                const newChat = [...chat]
                newChat.splice(index, 1);
                setChat(newChat);
                socket.emit('unsend', {to: username, message: msg, chatId});
            }
        })
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
        {inReport === true && <Report username={username} close={setInReport} isVisible={inReport} />}
        {inVideoCall !== null && <VideoCall username={username} myUsername={myUsername} setInVideoCall={setInVideoCall} />}
        <div ref={chatRef} className={`${styles.chat} ${inReport ? styles.rep : ''}`} onClick={() => inReport ? setInReport(false) : false}>
            <div className={styles['wrap-content']}>
                {profile !== undefined &&
                <div className={styles.profile}>
                    <div onClick={() => navigate('/app/view-profile/'+username)} className={styles['profile-pic']}>
                        <img src={profile.profile?.medias[0] ?? accountIcon} />
                    </div>
                    <span onClick={() => navigate('/app/view-profile/'+username)}>{profile.firstname + ' ' + profile.lastname}</span>
                    
                    <p>Be cautious about sharing personal info or photos with strangers. Keep things fun and safe! <i className="fa-solid fa-triangle-exclamation"></i> </p>
                </div>
                }
                {chat &&
                <div className={styles.msg}>
                    {chat.map((msg, ind) => {
                        return (
                            <p onClick={() => handleUnsend(msg, ind)} className={`${msg.sender !== username ? styles.send : ''}`} key={msg.timestamp.toString()}>
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
                <div>
                    <i onClick={() => window.innerWidth <= 768 ? navigate('/app/messages') : navigate('/app')} className={`fa-solid fa-angle-left ${styles['back-click']}`}>
                    </i>
                    <span onClick={() => navigate('/app/view-profile/'+username)}>
                        <div className={styles['pic']}>
                            <img src={profile.profile?.medias[0] ?? accountIcon} />
                        </div>
                        {profile.firstname}
                    </span>
                </div>
                
                <div>
                    <i onClick={() => doVideoCall()} className="fa-solid fa-video"></i>
                    <i onClick={() => setInReport(true)} className="fa-solid fa-shield-halved"></i>
                </div>
            </div>
            <div className={styles.typebox}>
                <i onClick={() => Swal.fire({text:'Coming soon...', showConfirmButton: false, backdrop: true, background: 'black'})} className="fa-solid fa-image"></i>
                <textarea ref={inputRef} value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder='Type here...' rows={1}></textarea>
                <span onClick={handleSendMessage}>Send</span>
            </div>
        </div>
        </>
    )
}