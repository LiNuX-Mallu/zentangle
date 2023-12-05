import styles from './AccountBig.module.css';
import pic from '../../../assets/images/man.jpg'
import { useEffect, useState } from 'react';
import axios from '../../../instances/axios';
import { ProfileInterface } from '../../../instances/interfaces';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading';
import { ApiUrl } from '../../../instances/urls';

export default function AccountBig() {
    const [loading, setLoading] = useState(true);
    const [profileDetails, setProfileDetails] = useState<ProfileInterface>();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/get-details').then(response => {
            if (response.status === 200) {
                setProfileDetails(response.data);
            }
        }).catch(() => {
            navigate('/home');
        }).finally(() => {
            setLoading(false);
        })
    }, [navigate]);

    const getAge = (dob: string) => {
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className={styles['account-big']}>
            <div className={styles.medias}>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    {/* <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div> */}
                    <div className="carousel-inner">
                        {profileDetails?.profile?.medias.map((link: string) => {
                            return (
                                <div className="carousel-item active">
                                    <img src={`${ApiUrl}/media/${link}`} className="d-block w-100" key={link} alt="media" />
                                </div>
                            )
                        })}
                        {!profileDetails?.profile?.medias.length &&
                            <div className="carousel-item active">
                                <img src={pic} className="d-block w-100" alt="NoMedia" />
                            </div>
                        }
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className={styles['name-age']}>
                <span className={styles.name}>{profileDetails && profileDetails.profile?.name || profileDetails?.firstname}</span>
                <span className={styles.age}>{profileDetails && getAge(profileDetails.dob)}</span>
                <i style={{color: profileDetails?.accountVerified ? 'purple' : 'gray'}} className="fa-solid fa-circle-check"></i>
            </div>
            <div className={styles['small-details']}>
                {profileDetails?.profile?.job?.title && <span>{profileDetails.profile.job.title}</span> }
                {profileDetails?.profile?.livingIn && <span>{profileDetails.profile.livingIn}</span> }
                {profileDetails?.profile?.school && <span>{profileDetails.profile.school}</span> }
            </div>
            <hr />
            <div className={styles['other-details']}>
                {profileDetails?.profile.bio ? <p className={styles.bio}>{profileDetails.profile.bio}</p> : <p className={styles.bio}>Bio...?</p> }
                <h4>Relationship Type</h4>
                <div className={styles.wrap}>
                    {profileDetails?.profile?.relationship?.openTo.length ?
                        (profileDetails?.profile?.relationship?.openTo.map((ele) => <span key={ele}>{ele}</span>)) : <span>None added</span>
                    }
                </div>
            </div>
            <hr />
            <div className={styles['other-details']}>
                <h4>Languages I Know</h4>
                <div className={styles.wrap}>
                    {profileDetails?.profile?.languages.length ?
                        (profileDetails?.profile?.languages.map((ele) => <span key={ele}>{ele}</span>)) : <span>None added</span>
                    }
                </div>
            </div>
            <hr />
            <div className={styles['other-details']}>
                <h4>Basics</h4>
                <div className={styles.wrap}>
                    {profileDetails?.profile?.basics && Object.keys(profileDetails?.profile?.basics).length ?
                    <>
                    {profileDetails?.profile?.basics?.zodiac && <span>{profileDetails.profile.basics.zodiac}</span> }
                    {profileDetails?.profile?.basics?.education && <span>{profileDetails.profile.basics.education}</span>}
                    {profileDetails?.profile?.basics?.familyPlan && <span>{profileDetails.profile.basics.familyPlan}</span>}
                    {profileDetails?.profile?.basics?.vaccinated && <span>{profileDetails.profile.basics.vaccinated}</span>}
                    {profileDetails?.profile?.basics?.personality && <span>{profileDetails.profile.basics.personality}</span>}
                    {profileDetails?.profile?.basics?.communication && <span>{profileDetails.profile.basics.communication}</span>}
                    {profileDetails?.profile?.basics?.loveStyle && <span>{profileDetails.profile.basics.loveStyle}</span>}
                    </>
                    : <span>None added</span>
                    }
                </div>
            </div>
            <hr />
            <div className={styles['other-details']}>
                <h4>Lifestyle</h4>
                <div className={styles.wrap}>
                    {profileDetails?.profile?.lifestyle && Object.keys(profileDetails?.profile?.lifestyle).length ?
                    <>
                    {profileDetails?.profile?.lifestyle?.pets && <span>{profileDetails.profile.lifestyle.pets}</span>}
                    {profileDetails?.profile?.lifestyle?.smoke && <span>{profileDetails.profile.lifestyle.smoke}</span>}
                    {profileDetails?.profile?.lifestyle?.drink && <span>{profileDetails.profile.lifestyle.drink}</span>}
                    {profileDetails?.profile?.lifestyle?.workout && <span>{profileDetails.profile.lifestyle.workout}</span>}
                    {profileDetails?.profile?.lifestyle?.diet && <span>{profileDetails.profile.lifestyle.diet}</span>}
                    {profileDetails?.profile?.lifestyle?.socialMedia && <span>{profileDetails.profile.lifestyle.socialMedia}</span>}
                    {profileDetails?.profile?.lifestyle?.sleep && <span>{profileDetails.profile.lifestyle.sleep}</span>}
                    </>
                    : <span>None added</span>
                    }
                </div>
            </div>
            <hr />
            <div style={{marginBottom: '2rem'}} className={styles['other-details']}>
                <h4>Passions</h4>
                <div className={styles.wrap}>
                    {profileDetails?.profile?.passions.length ?
                        (profileDetails?.profile?.passions.map((ele) => <span key={ele}>{ele}</span>)) : <span>None added</span>
                    }
                </div>
            </div>
            <div className={styles['edit-button']}>
                <button type='button' onClick={() => navigate('/app/account/edit-profile')}>Edit</button>
            </div>
        </div>
    )
}