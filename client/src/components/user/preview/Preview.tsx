import { useEffect, useState } from 'react';
import styles from './Preview.module.css';
import axios from '../../../instances/axios';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Preview({setSpace}: Props) {
    const [profile, setProfile] = useState<ProfileInterface | null>(null);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        axios.get('/user/get-details')
        .then((response) => {
            if (response.status === 200) {
                setProfile(response.data);
            }
        });
    }, []);

    const getAge = (dob: string) => {
        if (!dob) return '';
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    return (
        <div className={styles.preview}>
            <i onClick={() => setSpace('account')} className={`back-icon fa-solid fa-circle-chevron-left ${styles['back-icon']}`}></i>
            <div
                className={styles.details}
                style={{backgroundImage: `linear-gradient(to bottom, transparent 70%, black 100%), url(${ApiUrl}/media/${profile ? profile?.profile?.medias[imageIndex]: ''})`}}
            >
                {profile && profile?.profile?.medias[imageIndex+1] && <i onClick={() => setImageIndex(imageIndex+1)} className={`fa-solid fa-angle-right ${styles['right-click']}`}></i>}
                {profile && profile?.profile?.medias[imageIndex-1] && <i onClick={() => setImageIndex(imageIndex-1)} className={`fa-solid fa-angle-left ${styles['left-click']}`}></i>}
                
                <div className={styles['other-details']}>
                    <h3 className={styles.name}>{profile && (profile?.profile?.name || profile?.firstname)}{profile && profile.dob &&<span className={styles.age}>, {getAge(profile?.dob) ?? ''}</span>}</h3>
                    {profile && profile?.profile?.livingIn && imageIndex === 0 &&
                        <>
                        <span className={styles.living}><i className="fa-solid fa-house"></i> Lives in {profile.profile.livingIn}</span>
                        {profile && profile && (profile?.distance !== null && profile?.distance !== undefined) && <span className={styles.distance}><i className="fa-solid fa-location-dot"></i> {profile?.distance ? profile?.distance : 1} kilometers away</span>}
                        </>
                    }
                    {imageIndex === 1 &&
                        <>
                            {profile && profile?.profile?.job?.title && <span><i className="fa-solid fa-briefcase"></i> {profile.profile.job.title}</span>}
                            {profile && profile?.profile?.job?.company && <span> at {profile.profile.job.company}</span>}
                            <div className={styles.bio}>
                                <p><i className="fa-solid fa-feather"></i> {profile ? profile?.profile?.bio: ''}</p>
                            </div>
                        </>  
                    }
                    {profile && profile?.profile?.passions && imageIndex === 2 &&
                        <div className={styles['items']}>
                            {profile.profile.passions.map((passion) => {
                                return <span key={passion}>{passion}</span>
                            })}
                        </div>
                    }
                    {profile && profile?.profile?.lifestyle && imageIndex === 3 &&
                        <div className={styles['items']}>
                            {Object.entries(profile.profile.lifestyle).map(([key, value]) => {
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
                    {profile && profile?.profile?.basics && imageIndex === 4 &&
                        <div className={styles['items']}>
                            {profile?.profile?.languages && <span><i className="fa-solid fa-language"></i> {profile?.profile?.languages[0]}</span> }
                            {Object.entries(profile.profile.basics).map(([key, value]) => {
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
        </div>
    );
}
