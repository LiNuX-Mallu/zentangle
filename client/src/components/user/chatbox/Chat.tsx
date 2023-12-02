import { useEffect, useRef, useState } from 'react';
import axios from '../../../instances/axios';
import styles from './Chat.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading/Loading';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';

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
    const [chat, setChat] = useState<Message[]>()

    useEffect(() => {
        if (!username) return;
        axios.get(`/user/get-chat/${username}`)
        .then(response => {
            if (response.status === 200) {
                setChat(response.data?.chat);
                setProfile(response.data?.profile);
                setChat([
                    {message: 'hey', sender: username ? username : '', type: 'text', timestamp: new Date(), status: 'delivered'},
                    {message: 'whars up?', sender: username ? username : '', type: 'text', timestamp: new Date(), status: 'delivered'},
                    {message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit expedita delectus debitis ratione quas iusto accusamus harum tenetur vitae! Labore quos aperiam neque odio, quas quis mollitia delectus commodi veniam.', sender: username ? username : '', type: 'text', timestamp: new Date(), status: 'delivered'},

                    {message: 'hey', sender: 'me', type: 'text', timestamp: new Date(), status: 'delivered'},
                    {message: 'whars up?', sender: 'me', type: 'text', timestamp: new Date(), status: 'delivered'},
                    {message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit expedita delectus debitis ratione quas iusto accusamus harum tenetur vitae! Labore quos aperiam neque odio, quas quis mollitia delectus commodi veniam.', sender: 'me', type: 'text', timestamp: new Date(), status: 'delivered'},
                ])
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
    }, [chat])

    const formatTime = (timestamp: Date) => {
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
                {chat !== undefined &&
                <div className={styles.msg}>
                    {chat.map((msg, index) => {
                        return (
                            <p className={`${msg.sender !== username ? styles.send : ''}`} key={index}>
                                {msg.message}
                                <span className={styles.time}>{formatTime(msg.timestamp)}</span>
                            </p>
                        )
                    })}
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
                <textarea placeholder='Type here...' rows={1}></textarea>
                <span>Send</span>
            </div>
        </div>
    )
}