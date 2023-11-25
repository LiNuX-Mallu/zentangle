import { useEffect, useState, useRef } from 'react';
import styles from './Profile.module.css';
import axios from '../../../instances/axios';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';

export default function Profile() {
    const [startX, setStartX] = useState<number | null>(null);
    const [user, setUser] = useState<ProfileInterface | undefined>();
    const likeRef = useRef<HTMLElement>(null);
    const dislikeRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [imageIndex, setImageIndex] = useState(0);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setStartX(e.clientX);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        if (startX !== null) {
            const deltaX = e.clientX - startX;
            if (deltaX > 0 && likeRef.current && dislikeRef.current) {
                dislikeRef.current.style.transform = 'scale(1)';
                dislikeRef.current.style.backgroundColor = 'transparent';

                likeRef.current.style.transform = 'scale(1.5)';
                likeRef.current.style.backgroundColor = 'white';
            }
            
            if (deltaX < 0 && dislikeRef.current && likeRef.current) {
                likeRef.current.style.transform = 'scale(1)';
                likeRef.current.style.backgroundColor = 'transparent';

                dislikeRef.current.style.transform = 'scale(1.5)';
                dislikeRef.current.style.backgroundColor = 'white';
            }

            if (deltaX > 300 && likeRef.current) {
                likeRef.current.click();
                handleDragEnd();
            }
            
            if (deltaX < -300 && dislikeRef.current) {
                dislikeRef.current.click();
                handleDragEnd();
            }
        }
    };


    const handleDragEnd = () => {
        setStartX(null);
        if (likeRef.current) {
            likeRef.current.style.transform = 'scale(1)';
            likeRef.current.style.backgroundColor = 'transparent';
        }
        if (dislikeRef.current) {
            dislikeRef.current.style.transform = 'scale(1)';
            dislikeRef.current.style.backgroundColor = 'transparent';
        }
    };

    useEffect(() => {
        axios.get('/user/get-details').then(res => setUser(res.data));
    }, []);

    return (
        <div className={styles.profile}>
            <div
                className={styles.details}
                ref={profileRef}
                draggable={true}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{backgroundImage: `linear-gradient(to bottom, transparent 70%, black 100%), url(${ApiUrl}/media/${user?.profile?.medias[imageIndex]})`}}
            >
                {user?.profile?.medias[imageIndex+1] && <i onClick={() => setImageIndex(imageIndex+1)} className={`fa-solid fa-angle-right ${styles['right-click']}`}></i>}
                {user?.profile?.medias[imageIndex-1] && <i onClick={() => setImageIndex(imageIndex-1)} className={`fa-solid fa-angle-left ${styles['left-click']}`}></i>}

                <div className={styles['other-details']}>
                    <h3 className={styles.name}>{user?.profile?.name || user?.firstname}, <span className={styles.age}>21</span></h3>
                    {user?.profile?.livingIn && <span className={styles.living}><i className="fa-solid fa-house"></i> Lives in {user.profile.livingIn}</span> }
                </div>
            </div>
            <div className={styles.belowbar}>
                <i style={{color: 'silver'}}  className="fa-solid fa-rotate-right"></i>
                <i ref={dislikeRef} style={{color: 'lightsalmon'}} className="fa-solid fa-thumbs-down"></i>
                <i ref={likeRef} style={{color: 'cornflowerblue'}} className="fa-solid fa-thumbs-up"></i>
                <i style={{color: 'violet'}} className="fa-solid fa-heart"></i>
            </div>
        </div>
    );
}
