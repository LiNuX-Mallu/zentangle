import { useEffect, useState } from 'react';
import accountIcon from '../../../assets/images/account-icon.png';
import styles from './Account.module.css';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import { ProfileInterface } from '../../../instances/interfaces';
import Swal from 'sweetalert2';
import PreLoad from '../loading/preLoad/Preload';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Account({setSpace}: Props) {
    const [percentage, setPercentage] = useState(0);
    const navigate = useNavigate();
    const [profileDetails, setProfileDetails] = useState<ProfileInterface>();
    const [loading, setLoading] = useState(true);

    const conicStyle = {
        background: `conic-gradient(rgb(179, 30, 179) 0% ${percentage}%, white ${percentage}% 100%)`,
    }
    
    useEffect(() => {
        const timeout = setTimeout(() => setPercentage(75), 1000)
        return () => clearTimeout(timeout); 
    }, []);

    useEffect(() => {
        axios.get('/user/get-details').then(response => {
            if (response.status === 200) {
                setProfileDetails(response.data);
                setLoading(false);
            }
        }).catch(() => {
            navigate('/home');
        })
    }, [navigate]);

    const getAge = (dob: string) => {
        const current = new Date();
        const dateOfBirth = new Date(dob);
        return current.getFullYear() - dateOfBirth.getFullYear();
    }

    const handleBlueClick = () => {
        if (profileDetails?.accountVerified === 'notverified') setSpace('verification');   
        else if (profileDetails?.accountVerified === 'verified') return;
        else if (profileDetails?.accountVerified === 'pending') {
            Swal.fire({
                title: "Already requested for verification",
                text: "This will take upto 24 hours",
                backdrop: true,
                background: 'black',
                showConfirmButton: true,
            });
        }
    };

    if (loading) {
        return <PreLoad />
    }

    return (
        <div className={styles.account}>
            <div className={styles.profile}>
                <div style={conicStyle}>
                    <img src={(profileDetails && profileDetails?.profile.medias[0]) ? profileDetails?.profile.medias[0] : accountIcon}/>
                </div>
            </div>
            <span className={styles.completed}>{percentage}% completed</span>
            <div className={styles['name-age']}>
                <span className={styles.name}>{profileDetails && (profileDetails?.profile?.name && profileDetails?.profile?.name.trim() !== "") ? profileDetails.profile.name : profileDetails?.firstname},</span>
                <span className={styles.age}>{profileDetails && getAge(profileDetails.dob)}</span>
                <i onClick={handleBlueClick} style={{color: profileDetails?.accountVerified === 'verified' ? 'blueviolet' : 'gray'}} className="fa-solid fa-circle-check"></i>
            </div>
            <div className={styles.options}>
                <div onClick={() => navigate('/app/account/settings')} className={styles.icon}>
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </div>
                <div onClick={() => navigate('/app/account/edit-profile')} className={`${styles.icon}`}>
                    <i className="fa-solid fa-user-pen"></i>
                    <span>Edit details</span>
                </div>
                <div onClick={() => setSpace('preview')} className={styles.icon}>
                    <i className="fa-solid fa-mobile"></i>
                    <span>Preview</span>
                </div>

            </div>
        </div>
    )
}