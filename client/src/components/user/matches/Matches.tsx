import { useEffect, useState } from 'react';
import styles from './Matches.module.css';
import axios from '../../../instances/axios';
import { ApiUrl } from '../../../instances/urls';
import { timeAgo } from '../../../instances/timeAgo';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
interface Matches {
    type: string,
    likedBy: {profile: {name: string, medias: string[]}, username: string};
    with: {profile: {name: string, medias: string[]}, username: string};
    time: Date;
}

export default function Matches() {
    const [matches, setMatches] = useState<Matches[] | null>(null);
    const navigate = useNavigate();
    const [len, setLen] = useState(3);

    useEffect(() => {
        axios.get('/user/get-matches')
        .then(response => {
            if (response.status === 200) {
                setLen(response?.data?.length)
                setTimeout(() => {
                    setMatches(response?.data);
                }, 2000);
            }
        })
    }, []);

    if (!matches) {
        return (
            <div style={{padding: 0}} className={styles.matches}>
                {Array.from({length: len}, (_, index) => (
                    <div style={{padding: 0}} className={styles.box}>
                        <Skeleton key={index} variant='rectangular' animation='wave' sx={{width: '100%', height: '100%', bgcolor: 'grey.950'}} />
                    </div>
                ))}
            </div>
        )
    }

    if (matches.length === 0) {
        return <div className='d-flex justify-content-center h-100 text-white pt-5'>Start maching to get matches</div>
    }
    
    return (
        <div className={styles.matches}>
            {matches?.map((match) => {
                return (
                    <div 
                        onClick={() => navigate((match.type === 'like' || match.type === 'superLike') ? '/app/view-profile/'+match.likedBy.username : '/app/view-profile/'+match.with.username)}
                        key={match.time.toString()} 
                        className={styles.box}
                    >
                        <div style={{border: match.type === 'superLike' ? '2px solid purple' : '1px solid gray'}} className={styles['pro-pic']}>
                            <img
                                src={(match.type === 'like' || match.type === 'superLike') ? 
                                `${ApiUrl}/media/${match.likedBy?.profile?.medias[0]}` :
                                `${ApiUrl}/media/${match.with?.profile.medias[0]}` || ''}
                                alt="profile pic"
                            />
                        </div>
                        <div className={styles['name-alert']}>
                            {/* <h6>{(match.type === 'like' || match.type === 'superLike') ? match.likedBy.profile.name : match.with.profile.name}</h6> */}
                            <span>
                                {
                                    match.type === 'superLike' &&
                                    <>
                                        <i style={{color: 'rgb(194, 39, 194)'}} className="fa-solid fa-heart-circle-bolt"></i>
                                        <span>You got a super like from {match.likedBy.profile.name}</span>
                                    </>
                                }
                                {
                                    match.type === 'like' &&
                                    <>
                                        <i style={{color: 'rgb(212, 66, 66)'}} className="fa-solid fa-heart"></i>
                                        <span>Your profile liked by {match.likedBy.profile.name}</span>
                                    </>
                                }
                                {
                                    match.type === 'match' &&
                                    <>
                                        <i style={{color: 'white'}} className="fa-solid fa-people-pulling"></i>
                                        <span>You are matched with {match.with.profile.name}</span>
                                    </>
                                }
                            </span>
                        </div>
                        <div className={styles['when']}>
                            <span>{timeAgo(match.time)}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}