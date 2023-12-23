import { useEffect, useState } from 'react';
import styles from './Messages.module.css';
import axios from '../../../instances/axios';
import { ApiUrl } from '../../../instances/urls';
import { Message } from '../../../instances/interfaces';
import { timeAgo } from '../../../instances/timeAgo';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

interface Res {
    profile: {
        name: string;
        picture: string;
    };
    lastMessage: Message;
}

export default function Messages() {
    const [messages, setMessages] = useState<Res[] | null>(null);
    const navigate = useNavigate();
    const [len, setLen] = useState(3);

    useEffect(() => {
        axios.get('/user/get-messages')
        .then(response => {
            if (response.status === 200) {
                setLen(response.data?.length)
                setTimeout(() => {
                    setMessages(response?.data);
                }, 2000);
            }
        });
    }, []);

    if (!messages) {
        return (
            <div style={{padding: 0}} className={styles.messages}>
                {Array.from({length: len}, (_, index) => (
                    <div style={{padding: 0}} className={styles.msg}>
                        <Skeleton key={index} variant='rectangular' animation='wave' sx={{width: '100%', height: '100%', bgcolor: 'grey.950'}} />
                    </div>
                ))}
            </div>
        )
    }

    if (messages?.length === 0) {
        return <div className='d-flex justify-content-center h-100 text-white pt-5'>No messages</div>
    }

    return (
        <div className={styles.messages}>
            {
                messages?.map((message) => {
                    return (
                        <div onClick={() => navigate('/app/chat/'+message.profile.name)} key={message.lastMessage.timestamp.toString()} className={styles.msg}>
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