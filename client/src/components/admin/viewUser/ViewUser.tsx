import styles from './ViewUser.module.css';
import { useState } from 'react';
import { ProfileInterface } from '../../../instances/interfaces';
import { ApiUrl } from '../../../instances/urls';
import { useNavigate } from 'react-router-dom';

interface Props {
    defaultProfile: ProfileInterface | null;
}

export default function ViewUser({defaultProfile}: Props) {
    const [profile] = useState<ProfileInterface | null>(defaultProfile);
    const [imageIndex, setImageIndex] = useState(0);
    const navigate = useNavigate();

    const getAge = (dob: string) => {
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    return (
        <div className={styles['view-profile']}>
            <div className={styles['medias-container']}>
                <div
                    className={styles.medias}
                    style={{backgroundImage: `url(${ApiUrl}/media/${profile ? profile?.profile?.medias[imageIndex]: ''})`}}
                >
                </div>

                <i onClick={() => window.innerWidth <= 768 ? navigate('/app/matches') : navigate('/app')} className={`fa-solid fa-circle-arrow-left ${styles['back-click']}`}></i>
                {profile && profile.profile?.medias[imageIndex+1] && <i onClick={() => setImageIndex(imageIndex+1)} className={`fa-solid fa-angle-right ${styles['right-click']}`}></i>}
                {profile && profile.profile?.medias[imageIndex-1] && <i onClick={() => setImageIndex(imageIndex-1)} className={`fa-solid fa-angle-left ${styles['left-click']}`}></i>}
            </div>

            <div className={styles['name-age']}>
                <span className={styles.name}>{profile && profile.profile?.name || profile?.firstname}</span>
                <span className={styles.age}>{profile && getAge(profile.dob)}</span>
                <i style={{color: profile?.accountVerified ? 'blueviolet' : 'gray'}} className="fa-solid fa-circle-check"></i>
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
            {(profile && Object.values(profile?.profile?.languages).length) ?
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
            {(profile && Object.values(profile?.profile?.basics).length) ?
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
            </>: ''}
            <div className='p-3'></div>
        </div>
    )
}