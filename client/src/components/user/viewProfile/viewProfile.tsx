import styles from './viewProfile.module.css';
import { useEffect, useState } from 'react';
import axios from '../../../instances/axios';
import { ProfileInterface } from '../../../instances/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Report from '../report/Report';

interface Props {
    defaultProfile: ProfileInterface | null;
    blocked?: boolean;
    setPremium: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewProfile({defaultProfile, blocked = false, setPremium}: Props) {
    const [profile, setProfile] = useState<ProfileInterface | null>(defaultProfile);
    const [imageIndex, setImageIndex] = useState(0);
    const { username } = useParams();
    const navigate = useNavigate();
    const [inReport, setInReport] = useState(false);

    useEffect(() => {
        if (!username || profile) return;
        axios.get(`/user/get-profile/${username}`).then(response => {
            if (response.status === 200) {
                setProfile(response?.data);
            }
        }).catch(() => {
            alert("Internal server error");
        })
    }, [username, profile]);

    const getAge = (dob: string) => {
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    const handleLike = (isSuper: boolean) => {
        if (!profile) return;
        axios.post('/user/like-profile', {profileId: profile._id, isSuper}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                if (response.data.matched) {
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
                        setProfile(null);
                        window.innerWidth <= 768 ? navigate('/app/matches') : navigate('/app');
                    })
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
        if (!profile) return;
        axios.post('/user/dislike-profile', {profileId: profile._id}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.status === 200) {
                setProfile(null);
                navigate('/app')
                window.innerWidth <= 768 ? navigate('/app/matches') : navigate('/app');
            }
        })
        .catch(() => alert("Internal server error"));
    };

    const handleBlock = async () => {
        if (!username) return;
        const swal = await Swal.fire({
            text: `Are you sure want to block ${username}?`,
            color: 'white',
            icon: 'info',
            backdrop: true,
            background: 'black',
            confirmButtonColor: 'orangered',
            showCancelButton: true,
            cancelButtonText: "No, don't block",
            confirmButtonText: `Yes, block ${username}`,
            cancelButtonColor: 'gray',
            focusCancel: true,
        });
        if (!swal.isConfirmed) return;
        axios.post('/user/block-user', {username}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate('/app');
            }
        });
    }

    const handleUnmatch = async () => {
        if (!username) return;
        const swal = await Swal.fire({
            text: `Are you sure want to Unmatch with ${username}?`,
            color: 'white',
            icon: 'info',
            backdrop: true,
            background: 'black',
            confirmButtonColor: 'orangered',
            showCancelButton: true,
            cancelButtonText: "No, don't Unmatch",
            confirmButtonText: `Yes, Unmatch ${username}`,
            cancelButtonColor: 'gray',
            focusCancel: true,
        });
        if (!swal.isConfirmed) return;
        axios.post('/user/unmatch-user', {username}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate('/app');
            }
        });
    }

    if (inReport) {
        return <Report username={username} close={setInReport} isVisible={inReport} />
    }

    if (!profile) {
        return null
    }

    return (
        <>
        <div className={styles['view-profile']}>
            <div className={styles['medias-container']}>
                <div
                    className={styles.medias}
                    style={{backgroundImage: `url(${profile ? profile?.profile?.medias[imageIndex]: ''})`}}
                >
                </div>

                <i onClick={() => window.innerWidth <= 768 ? navigate('/app/matches') : navigate('/app')} className={`fa-solid fa-circle-arrow-left ${styles['back-click']}`}></i>
                {profile && profile.profile?.medias[imageIndex+1] && <i onClick={() => setImageIndex(imageIndex+1)} className={`fa-solid fa-angle-right ${styles['right-click']}`}></i>}
                {profile && profile.profile?.medias[imageIndex-1] && <i onClick={() => setImageIndex(imageIndex-1)} className={`fa-solid fa-angle-left ${styles['left-click']}`}></i>}
            </div>

            <div className={styles['name-age']}>
                <span className={styles.name}>{profile && profile.profile?.name || profile?.firstname}</span>
                <span className={styles.age}>{profile && getAge(profile.dob)}</span>
                <i style={{color: profile?.accountVerified === 'verified' ? 'blueviolet' : 'gray'}} className="fa-solid fa-circle-check"></i>
            </div>
            <div className={styles['small-details']}>
                {profile && profile?.profile?.job?.title && <span><i className="fa-solid fa-briefcase"></i> {profile.profile.job.title}</span>}
                {profile && profile?.profile?.job?.company && <span> at {profile.profile.job.company}</span>}
                {profile?.profile?.livingIn ? <span><i className="fa-solid fa-house"></i> Lives in {profile.profile.livingIn}</span> : ''}
                {/* {profile?.profile?.school && <span>{profile.profile.school}</span> } */}
                {(profile && profile.distance) ? <span className={styles.distance}><i className="fa-solid fa-location-dot"></i> {profile?.distance} kilometers away</span>: ''}
            </div>
            <hr />
            <div className={styles['other-details']}>
                {profile?.profile.bio ? <p className={styles.bio}>{profile.profile.bio}</p> : <p className={styles.bio}>Bio...?</p> }
                <h4>Relationship Type</h4>
                <div className={styles.wrap}>
                    {profile?.profile?.relationship?.openTo.length ?
                        (profile?.profile?.relationship?.openTo.map((ele) => <span key={ele}>{ele}</span>)) : <span>None added</span>
                    }
                </div>
            </div>

            <hr />

            {/* languages */}
            {(profile && profile?.profile?.languages && Object.values(profile?.profile?.languages).length) ?
            <>
                <div className={styles['other-details']}>
                    <h4>Languages I Know</h4>
                    <div className={styles.wrap}>
                        {profile?.profile?.languages.length ?
                            (profile?.profile?.languages.map((ele) => <span key={ele}>{ele}</span>)) : <span>None added</span>
                        }
                    </div>
                </div>
                <hr />
            </>
            : ''}
            
            {/* passions */}
            {(profile && profile?.profile?.passions.length) ?
            <>
                <div style={{marginBottom: '2rem'}} className={styles['other-details']}>
                    <h4>Passions</h4>
                    <div className={styles.wrap}>
                        {profile && profile?.profile?.passions.map((passion) => {
                            return <span key={passion}>{passion}</span>
                        })}
                    </div>
                </div>
                <hr />
            </>: ''}

            {/* basics */}
            {(profile && profile.profile?.basics && Object.values(profile?.profile?.basics).length) ?
            <>
                <div className={styles['other-details']}>
                    <h4>Basics</h4>
                    <div className={styles.wrap}>
                        {Object.entries(profile?.profile?.basics).map(([key, value]) => {
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
                </div>
                <hr />
            </> : ''}

            

            {/* lifestyle */}
            {(profile && profile.profile.lifestyle && Object.values(profile.profile.lifestyle).length) ?
            <>
                <div className={styles['other-details']}>
                    <h4>Lifestyle</h4>
                    <div className={styles.wrap}>
                        {Object.entries(profile?.profile?.lifestyle).map(([key, value]) => {
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
                </div>
                <hr />
            </>: ''}

            {/* unmatch */}
            {profile && profile.matched === true &&
            <> 
                <div onClick={handleUnmatch} className={styles.options}>
                    <div>
                        <h4>Unmatch {profile?.profile?.name}</h4>
                        <p>No longer friends</p>
                    </div>
                </div>
                <hr />
            </>
            }

            {/* block */}
            {blocked === false && <>
                <div onClick={handleBlock} className={styles.options}>
                    <div>
                        <h4>Block {profile?.profile?.name}</h4>
                        <p>You won't see them, they won't see you.</p>
                    </div>
                </div>
                <hr />
            </>}

            {/* report */}
            <div onClick={() => setInReport(true)} className={styles.options}>
                <div>
                    <h4>Report {profile?.profile?.name}</h4>
                    <p>Don't worry we won't tell them.</p>
                </div>
            </div>
           {blocked === false && <div className={`${(!profile?.matched) ? 'p-5' : 'p-4'}`}></div>}

            {profile && (!profile.matched || (!profile.liked && !profile.matched)) && blocked === false &&
            <div className={styles.belowbar}>
                <i onClick={handleDislike} style={{color: 'lightsalmon'}} className="fa-solid fa-thumbs-down"></i>
                <i onClick={() => handleLike(false)} style={{color: 'cornflowerblue'}} className="fa-solid fa-thumbs-up"></i>
                <i onClick={() => handleLike(true)} style={{color: 'violet'}} className="fa-solid fa-heart-circle-bolt"></i>
            </div>}
            {(profile && profile.matched) ? <div onClick={() => navigate(`/app/chat/${profile.username}`)} className={styles['belowbar']}>
                <span className={styles['send-message']}>Send message</span>
            </div>: ''}
            
        </div>
        </>
    )
}