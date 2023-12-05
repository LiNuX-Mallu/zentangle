import { useEffect, useState } from 'react';
import styles from './Messages.module.css';
import axios from '../../../instances/axios';
import { ApiUrl } from '../../../instances/urls';
import { Message } from '../../../instances/interfaces';
import { timeAgo } from '../../../instances/timeAgo';
import { useNavigate } from 'react-router-dom';

interface Res {
    profile: {
        name: string;
        picture: string;
    };
    lastMessage: Message;
}

export default function Messages() {
    const [messages, setMessages] = useState<Res[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/get-messages')
        .then(response => {
            if (response.status === 200) {
                setMessages(response?.data);
            }
        });
    }, []);

    return (
        <div className={styles.messages}>
            {
                messages?.map((message) => {
                    return (
                        <div onClick={() => navigate('/app/chat/'+message.profile.name)} key={message.profile.name} className={styles.msg}>
                            <div className={styles.propic}>
                                <img src={`${ApiUrl}/media/${message.profile?.picture}`} alt="profile picture" />
                            </div>
                            <div className={styles['name-msg']}>
                                <span>{message.profile.name}</span>
                                <div className={styles['msg-time']}>
                                    <span>{message?.lastMessage?.sender === message.profile.name ? message.lastMessage.sender : 'You'}: {message.lastMessage.message.slice(0, 10)}
                                    {message.lastMessage.message.length > 10 ? '... ': ' '}
                                        {
                                            (message.lastMessage.sender !== message.profile.name) ?
                                            message?.lastMessage?.status === 'send' ? 
                                            <i className="fa-regular fa-circle-check"></i> :
                                            message?.lastMessage?.status === 'seen' ?
                                            <i className="fa-solid fa-circle-check"></i> :
                                            <i className="fa-regular fa-clock"></i>
                                            : ''
                                        }
                                    </span>
                                    <span style={{fontSize: '12px'}}>{timeAgo(message.lastMessage.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}