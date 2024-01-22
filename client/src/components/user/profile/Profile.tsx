import { useEffect, useState, useRef } from 'react';
import styles from './Profile.module.scss';
import axios from '../../../instances/axios';
import { ProfileInterface } from '../../../instances/interfaces';
import Swal from 'sweetalert2';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';

interface Props {
    setMatchKey: React.Dispatch<React.SetStateAction<string>>;
    setPremium: React.Dispatch<React.SetStateAction<boolean>>;
    allowed: boolean;
    explore?: string;
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Profile({setMatchKey, setPremium, allowed, explore, setSpace}: Props) {
    const [startX, setStartX] = useState<number | null>(null);
    const [profiles, setProfiles] = useState<ProfileInterface[] | undefined>();
    const [userIndex, setUserIndex] = useState<number>(0);

    const navigate = useNavigate();
    const likeRef = useRef<HTMLElement>(null);
    const dislikeRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [imageIndex, setImageIndex] = useState<number>(0);

    useEffect(() => {
        if (profiles || allowed === false) return;
        setUserIndex(0);
        setImageIndex(0);
        axios.get(`/user/get-profiles/${explore ?? 'none'}`)
        .then((response) => {
            if (response.status === 200) {
                setTimeout(() => {
                    setProfiles(response?.data as ProfileInterface[] ?? []);
                }, 1500);
            }
        }).catch((error) => {
            if (error.response.status === 402) {
                setPremium(true);
            }
        })
    }, [profiles, allowed, explore, setPremium]);

    useEffect(() => {
        if (allowed === false) return;
        setProfiles(undefined);
        setUserIndex(0);
        setImageIndex(0);
        axios.get(`/user/get-profiles/${explore ?? 'none'}`)
        .then((response) => {
            if (response.status === 200) {
                setTimeout(() => {
                    setProfiles(response?.data as ProfileInterface[] ?? []);
                }, 1500);
            }
        }).catch((error) => {
            if (error.response.status === 402) {
                setPremium(true);
            }
        })
    }, [allowed, explore, setPremium]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setStartX(e.clientX);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        if (startX !== null) {
            const deltaX = e.clientX - startX;
            
            if (deltaX > 50 && likeRef.current && dislikeRef.current) {
                dislikeRef.current.style.transform = 'scale(1)';
                dislikeRef.current.style.backgroundColor = 'transparent';

                likeRef.current.style.transform = 'scale(1.5)';
                likeRef.current.style.backgroundColor = 'white';
            } else if (deltaX < -50 && dislikeRef.current && likeRef.current) {
                likeRef.current.style.transform = 'scale(1)';
                likeRef.current.style.backgroundColor = 'transparent';

                dislikeRef.current.style.transform = 'scale(1.5)';
                dislikeRef.current.style.backgroundColor = 'white';
            } else {
                if (!likeRef.current || !dislikeRef.current) return;
                likeRef.current.style.transform = 'scale(1)';
                likeRef.current.style.backgroundColor = 'transparent';
                dislikeRef.current.style.transform = 'scale(1)';
                dislikeRef.current.style.backgroundColor = 'transparent';
            }

            if (deltaX) return;
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

    const getAge = (dob: string) => {
        if (!dob) return '';
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    const handleLookBack = () => {
        if (profiles && profiles[userIndex-1]) {
            setImageIndex(0);
            setUserIndex(userIndex-1);
        }
    };

    const handleLike = (isSuper: boolean) => {
        if (!profiles || !profiles[userIndex]) return;
        axios.post('/user/like-profile', {profileId: profiles[userIndex]._id, isSuper}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.status === 200) {
                if (response.data.matched) {
                    const temp = [...profiles];
                    temp.splice(userIndex, 1);
                    setProfiles(temp);
                    Swal.fire({
                        position: 'center',
                        icon: "success",
                        iconColor: "purple",
                        background: 'black',
                        color: 'white',
                        title: "Congo, It's a match!",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        setImageIndex(0);
                        setMatchKey(Date.now().toString());
                    })
                }
                if (profiles && profiles[userIndex+1]) {
                    setImageIndex(0);
                    setUserIndex(pre => pre + 1);
                } else {
                    setProfiles(undefined);
                }
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                if (error.response?.data?.error === 'premium') {
                    setPremium(true);
                } else if (error.response?.data?.error === 'super') {
                    Swal.fire({
                        text: 'Daily Limit Reached 1/1',
                        backdrop: true,
                        background: 'black',
                        color: 'white',
                        confirmButtonColor: 'blueviolet',
                        showConfirmButton: true,
                        iconHtml: '<i class="fa-solid fa-heart-circle-bolt"></i>',
                        iconColor: 'violet',
                        focusConfirm: false,
                    });
                }
            }
        })
    };

    const handleDislike = () => {
        if (!profiles || !profiles[userIndex]) return;
        axios.post('/user/dislike-profile', {profileId: profiles[userIndex]._id}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.status === 200) {
                if (profiles && profiles[userIndex+1]) {
                    setImageIndex(0);
                    setUserIndex(userIndex+1);
                } else {
                    setProfiles(undefined);
                }
            }
        });
    };

    if (allowed === false) {
        return (
            <div className={`${styles.profile} ${(explore && explore !== 'none') ? styles.explore : ''}`}>
                <div className={`${styles.empty} ${styles.notallowed}`}>
                    <h5 onClick={() => navigate('/app/account/edit-profile')}>Go to Profile <i className="fa fa-angle-right"></i> </h5>
                    <p>Complete basic profiles to start matching</p>
                    <i className="fa-solid fa-circle-info fa-fade"></i>
                </div>
                <div className={styles.belowbar}>
                    <i className="fa-solid fa-rotate-right"></i>
                    <i className="fa-solid fa-thumbs-down"></i>
                    <i className="fa-solid fa-thumbs-up"></i>
                    <i className="fa-solid fa-heart-circle-bolt"></i>
                </div>
            </div>
        )
    }

    if (profiles && (profiles.length === 0 || profiles[userIndex] === undefined)) {
        return (
            <div className={`${styles.profile} ${(explore && explore !== 'none') ? styles.explore : ''}`}>

                <span onClick={() => setSpace('explore')} className={styles.title}>
                    <i className="fa-solid fa-xmark"></i>
                    {
                        explore === 'befriends' ? "Let's be Friends":
                        explore === 'forlove' ? "Looking for Love":
                        explore === 'coffeedate' ? "Coffee Date":
                        explore === 'freetonight' ? "Free Tonight?":
                        explore === 'verified' ? "Verified Profiles": ""
                    }
                </span>

                <div className={styles.empty}>
                    <p>Sorry we are out of profiles nearby</p>
                    <i onClick={() => setProfiles(undefined)} className="fa-solid fa-rotate-right fa-beat fa-lg"></i>
                </div>
                <div className={styles.belowbar}>
                    <i className="fa-solid fa-rotate-right"></i>
                    <i className="fa-solid fa-thumbs-down"></i>
                    <i className="fa-solid fa-thumbs-up"></i>
                    <i className="fa-solid fa-heart-circle-bolt"></i>
                </div>
            </div>
        )
    }

    if (profiles === undefined) {
        return (
            <div className={`${styles.profile} ${(explore && explore !== 'none') ? styles.explore : ''}`}>
                <div className={styles.details}>
                    <Skeleton variant='rectangular' animation='wave' sx={{bgcolor: 'grey.900', height: '100%', width: '100%'}}/>
                </div>
                <div style={{backgroundColor: '#1f1f1f'}} className={styles.belowbar}>
                    <Skeleton variant='circular' animation='pulse' sx={{bgcolor: 'grey.800', height: 50, width: 50}}></Skeleton>
                    <Skeleton variant='circular' animation='pulse' sx={{bgcolor: 'grey.800', height: 50, width: 50}}></Skeleton>
                    <Skeleton variant='circular' animation='pulse' sx={{bgcolor: 'grey.800', height: 50, width: 50}}></Skeleton>
                    <Skeleton variant='circular' animation='pulse' sx={{bgcolor: 'grey.800', height: 50, width: 50}}></Skeleton>
                </div>
            </div>
        )
    }

    if (profiles && profiles[userIndex]) {
    return (
        <div id='profileContainer' className={`${styles.profile} ${(explore && explore !== 'none') ? styles.explore : ''}`}>

            <span onClick={() => setSpace('explore')} className={styles.title}>
                <i className="fa-solid fa-xmark"></i>
                {
                    explore === 'befriends' ? "Let's be Friends":
                    explore === 'forlove' ? "Looking for Love":
                    explore === 'coffeedate' ? "Coffee Date":
                    explore === 'freetonight' ? "Free Tonight?":
                    explore === 'verified' ? "Verified Profiles": ""
                }
            </span>
            
            <div
                onClick={() => profiles[userIndex]?.username && navigate('/app/view-profile/'+profiles[userIndex]?.username)}
                className={styles.details}
                ref={profileRef}
                draggable={true}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{cursor: 'pointer', backgroundImage: `linear-gradient(to bottom, transparent 70%, black 100%), url(${profiles ? profiles[userIndex]?.profile?.medias[imageIndex]: ''})`}}
            >
                {profiles && profiles[userIndex]?.profile?.medias[imageIndex+1] && <i onClick={(e) => {e.stopPropagation(); setImageIndex(imageIndex+1)}} className={`fa-solid fa-angle-right ${styles['right-click']}`}></i>}
                {profiles && profiles[userIndex]?.profile?.medias[imageIndex-1] && <i onClick={(e) => {e.stopPropagation(); setImageIndex(imageIndex-1)}} className={`fa-solid fa-angle-left ${styles['left-click']}`}></i>}
                
                <div className={styles['other-details']}>
                    <h3 className={styles.name}>{profiles && (profiles[userIndex]?.profile?.name?.length ? profiles[userIndex]?.profile?.name : profiles[userIndex]?.firstname)}{profiles && profiles[userIndex]?.dob &&
                        <span className={styles.age}>, {getAge(profiles[userIndex]?.dob) ?? ''}</span>}
                        &nbsp; 
                        {profiles[userIndex] && profiles[userIndex]?.accountVerified === 'verified' && <i style={{color: 'blueviolet'}} className="fa-solid fa-circle-check"></i>}
                    </h3>

                    {profiles && profiles[userIndex]?.profile?.livingIn && imageIndex === 0 &&
                        <>
                        <span className={styles.living}><i className="fa-solid fa-house"></i> Lives in {profiles[userIndex].profile.livingIn}</span>
                        {profiles && profiles[userIndex] && (profiles[userIndex]?.distance !== null && profiles[userIndex]?.distance !== undefined) && <span className={styles.distance}><i className="fa-solid fa-location-dot"></i> {profiles[userIndex]?.distance !== 0 ? profiles[userIndex]?.distance : 1} kilometers away</span>}
                        </>
                    }
                    {imageIndex === 1 &&
                        <>
                            {profiles && profiles[userIndex]?.profile?.job?.title && <span><i className="fa-solid fa-briefcase"></i> {profiles[userIndex].profile.job.title}</span>}
                            {profiles && profiles[userIndex]?.profile?.job?.company && <span> at {profiles[userIndex].profile.job.company}</span>}
                            <div className={styles.bio}>
                                <p><i className="fa-solid fa-feather"></i> {profiles ? profiles[userIndex]?.profile?.bio: ''}</p>
                            </div>
                        </>  
                    }
                    {profiles && profiles[userIndex]?.profile?.passions && imageIndex === 2 &&
                        <div className={styles['items']}>
                            {profiles[userIndex].profile.passions.map((passion) => {
                                return <span key={passion}>{passion}</span>
                            })}
                        </div>
                    }
                    {profiles && profiles[userIndex]?.profile?.lifestyle && imageIndex === 3 &&
                        <div className={styles['items']}>
                            {Object.entries(profiles[userIndex].profile.lifestyle).map(([key, value]) => {
                                if (!value) return;
                                return(
                                    <span key={key}>
                                        {key === 'smoke' && <i className="fa-solid fa-smoking"></i> }
                                        {key === 'drink' && <i className="fa-solid fa-wine-bottle"></i> }
                                        {key === 'workout' && <i className="fa-solid fa-dumbbell"></i> }
                                        {key === 'pets' && <i className="fa-solid fa-paw"></i>}
                                        {key === 'diet' && <i className="fa-solid fa-utensils"></i> }
                                        {key === 'socialMedia' && <i className="fa-solid fa-mobile-screen"></i> }
                                        {key === 'sleep' && <i className="fa-solid fa-bed"></i>}
                                        {value}
                                    </span>
                                );
                            })}
                        </div>
                    }
                    {profiles && profiles[userIndex]?.profile?.basics && imageIndex === 4 &&
                        <div className={styles['items']}>
                            {profiles[userIndex]?.profile?.languages && <span><i className="fa-solid fa-language"></i> {profiles[userIndex]?.profile?.languages[0]}</span> }
                            {Object.entries(profiles[userIndex].profile.basics).map(([key, value]) => {
                                if (!value) return;
                                return(
                                    <span key={key}>
                                        {key === 'zodiac' && <i className="fa-solid fa-moon"></i> }
                                        {key === 'education' && <i className="fa-solid fa-graduation-cap"></i> }
                                        {key === 'familyPlan' && <i className="fa-solid fa-baby-carriage"></i> }
                                        {key === 'vaccinated' && <i className="fa-solid fa-syringe"></i>}
                                        {key === 'personality' && <i className="fa-solid fa-puzzle-piece"></i> }
                                        {key === 'communication' && <i className="fa-solid fa-message"></i> }
                                        {key === 'loveStyle' && <i className="fa-solid fa-heart-circle-bolt"></i> }
                                        {value}
                                    </span>
                                );
                            })}
                        </div>
                    }
                </div>

            </div>
            <div className={`${styles.belowbar} ${styles.enabled}`}>
                <i onClick={handleLookBack} style={{color: 'silver'}}  className="fa-solid fa-rotate-right"></i>
                <i ref={dislikeRef} onClick={handleDislike} style={{color: 'lightsalmon'}} className="fa-solid fa-thumbs-down"></i>
                <i ref={likeRef} onClick={() => handleLike(false)} style={{color: 'cornflowerblue'}} className="fa-solid fa-thumbs-up"></i>
                <i onClick={() => handleLike(true)} style={{color: 'violet'}} className="fa-solid fa-heart-circle-bolt"></i>
            </div>
        </div>
    );
    }
}
