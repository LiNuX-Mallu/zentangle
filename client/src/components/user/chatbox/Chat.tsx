import { useEffect, useRef, useState } from 'react';
import axios from '../../../instances/axios';
import styles from './Chat.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading/Loading';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';
import { socket } from '../../../instances/socket';

interface Message {
    sender: string;
    type: string;
    message: string;
    timestamp: Date;
    status: string;
}

export default function Chat() {
    const navigate = useNavigate();
    const {username} = useParams();
    const chatRef = useRef<HTMLDivElement>(null);

    const [profile, setProfile] = useState<ProfileInterface>();
    const [me, setMe] = useState<ProfileInterface>();
    const [chat, setChat] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const [inputMessage, setInputMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(socket.connected);


    useEffect(() => {
        if (!me) return;
        socket.connect();

        function onConnect() {
            setSocketConnected(true);
        }
        function onDisconnect() {
            setSocketConnected(false);
        }
        function onReceiveMessage(message: Message) {
            setChat((prev) => [...prev, message]);
        }
        function onReceiveChatId(id: string) {
            setChatId(id);
        }
        function onTyping(flag: boolean) {
            setIsTyping(flag);
        }

        socket.emit('joinChat', me?.username);
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('receiveMessage', onReceiveMessage);
        socket.on('receiveChatId', onReceiveChatId);
        socket.on('isTyping', onTyping);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('receiveMessage', onReceiveMessage);
            socket.off('receiveChatId', onReceiveChatId);
            socket.off('onTyping', onTyping);
            socket.emit('leaveChat', me?.username);
            socket.disconnect();
        }
    }, [me]);

    const handleSendMessage = () => {
        if (!me?.username || !profile) return;
        if (inputMessage.trim() === '' || !socketConnected) return;
        const message = {
            sender: me?.username,
            message: inputMessage,
            type: 'text',
            timestamp: new Date(),
            status: 'send',
        };
        socket.emit('sendMessage', {message, to: username, chatId});
        setInputMessage('');
        setChat([...chat, message]);
    }

    useEffect(() => {
        if (inputMessage.length !== 0) {
            socket.emit('typing', {username, flag: true});
        } else if (inputMessage.length === 0) socket.emit('typing', {username, flag: false});
    }, [inputMessage, username]);


    useEffect(() => {
        if (!username) return;
        axios.get(`/user/get-chat/${username}`)
        .then(response => {
            if (response.status === 200) {
                setChat(response.data?.chat);
                setMe(response.data?.me);
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

    if (!username || !profile) return <Loading />
    return (
        <div ref={chatRef} className={styles.chat}>
            <div className={styles['wrap-content']}>
                {profile !== undefined &&
                <div className={styles.profile}>
                    <div className={styles['profile-pic']}>
                        <img src={`${ApiUrl}/media/${profile.profile?.medias[0]}`} />
                    </div>
                    <span>{profile.firstname + ' ' + profile.lastname}</span>
                    
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
                    <i className="fa-solid fa-video"></i>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div className={styles.typebox}>
                <i className="fa-solid fa-image"></i>
                <textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder='Type here...' rows={1}></textarea>
                <span onClick={handleSendMessage}>Send</span>
            </div>
        </div>
    )
}