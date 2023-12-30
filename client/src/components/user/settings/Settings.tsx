import styles from './Settings.module.css';
import toggle from './extra/toggle.module.css';
import homeIcon from '../../../assets/images/home-icon.png';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProfileInterface } from '../../../instances/interfaces';
import Loading from '../loading/Loading';
import { useSelector } from 'react-redux';
import { getLocation } from '../../../redux/actions/locationActions';
import Axios from 'axios';
import EditEmail from './childComponents/editEmail/EditEmail';
import EditPhone from './childComponents/editPhone/EditPhone';
import MultiRangeSlider, { ChangeResult } from 'multi-range-slider-react';
import './extra/multiSlider.css';
import EditPassword from './childComponents/editPassword/EditPassword';
import BlockedUsers from './childComponents/blockedUsers/BlockedUsers';
import formatDate from '../../../instances/formatDate';

interface Props {
    setPremium: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Settings({setPremium}: Props) {
    const navigate = useNavigate();
    const [editSpace, setEditSpace] = useState<string | null>(null);
    const [user, setUser] = useState<ProfileInterface | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const rightIcon = <i className="fa-solid fa-angle-right"></i>;

    const [distance, setDistance] = useState("");
    const [onlyFromAgeRange, setOnlyAgeRange] = useState<boolean>();
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(27);
    const [global, setGlobal] = useState(true);
    const [discovery, setDiscovery] = useState(true);
    const [incognitoMode, setIncognitoMode] = useState(false);
    //const [recentActiveStatus, setRecentActiveStatus] = useState(true);
    const [showAge, setShowAge] = useState(true);
    const [showDistance, setShowDistance] = useState(true);
    const [verfiedMessagesOnly, setVerifiedMessagesOnly] = useState(false);
    const [readReceipt, setReadReceipt] = useState(true); 

    const location = useSelector(getLocation);
    const [locality, setLocality] = useState("Fetching...");

    const handleLogout = () => {
        axios.post('/user/logout').catch(() => alert("Internal server error"));
        navigate('/home')
    }

    useEffect(() => {
        //Locality
        Axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location?.latitude}&longitude=${location?.longitude}&localityLanguage=en`)
        .then(response => {
            if (response.status === 200) {
                setLocality(response?.data?.locality+', '+response?.data?.city);
            }
        })

        // Profile details
        axios.get('/user/get-details')
        .then((response) => {
            if (response.status === 200) {
                setUser(response.data);
                setDistance(response?.data?.preferences?.distance);
                setOnlyAgeRange(response?.data?.preferences?.onlyFromAgeRange);
                setMinAge(response?.data?.preferences?.ageRange?.min);
                setMaxAge(response?.data?.preferences?.ageRange?.max);
                setGlobal(response?.data?.preferences?.global);
                setDiscovery(response?.data?.privacy?.discoverable);
                setIncognitoMode(response?.data?.privacy?.incognitoMode);
                setShowAge(response?.data?.privacy?.showAge);
                setShowDistance(response?.data?.privacy?.showDistance);
                setVerifiedMessagesOnly(response?.data?.privacy?.verifiedMessagesOnly);
                setReadReceipt(response?.data?.privacy?.readReceipt);
                //setRecentActiveStatus(response?.data?.privacy?.recentActiveStatus);
            }
        })
        .catch(() => alert("Internal server error"))
        .finally(() => setLoading(false));
    }, [location, locality, editSpace]);

    //update distance preference
    const updateDistancePreference = (data: string) => {
        const temp = distance;
        setDistance(data);
        axios.put("/user/update-settings", {where: 'distance', what: +data}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(() => {
            setDistance(temp);
        });
    }

    //update age preference
    const updateAgePreference = (min: number, max: number) => {
        axios.put("/user/update-settings", {where: 'ageRange', what: {min, max}}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    };

    //update toggles
    const updateToggle = (resource: string, data: boolean) => {
        axios.put(`/user/update-settings/`, {where: resource, what: data}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    if (loading) return <Loading />
    return(
        <div className={styles.settings}>
            <div className={styles.topbar}>
                <img onClick={() => navigate('/app')} src={homeIcon} />
                <span onClick={() => navigate('/app/account')}><i className="fa-solid fa-angle-left"></i> Settings</span>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* account settings */}
            <div className={styles.division}>
                <h5>Account settings</h5>
                <div onClick={() => setEditSpace('email')} className={styles.option}>
                    <span>Email</span>
                    <span>
                        {user && user?.email?.email}
                        {rightIcon}
                    </span>
                </div>
                <div onClick={() => setEditSpace('phone')} className={styles.option}>
                    <span>Phone</span>
                    <span>
                        {user && `+${user.phone.countryCode}  ${user?.phone?.phone}`}
                        {rightIcon}
                    </span>
                </div>
                <div onClick={() => setEditSpace('password')} className={styles.option}>
                    <span>Password</span>
                    <span>
                        {user && "*".repeat(user?.password.length)}
                        {rightIcon}
                    </span>
                </div>
                <div onClick={() => (user?.premium?.expireDate === undefined || new Date(user?.premium?.expireDate) < new Date()) ? setPremium(true) : false} className={styles.option}>
                    <span>Premium Plan <i className="fa-solid fa-crown"></i></span>
                    <span>
                        {user?.premium?.expireDate ? new Date(user.premium.expireDate) >= new Date() ? `valid till ${formatDate(user.premium.expireDate)}` : 'no active plan' : 'no active plan'}
                    </span>
                </div>
            </div>

            {/* discovery settings */}
            <div className={styles.division}>
                <h5>Disovery settings</h5>
                <div className={styles.option}>
                    <span>Location</span>
                    <span>{locality}</span>
                </div>
                <div className={`${styles.range}`}>
                    <span>Distance preference
                        <span>{distance ? distance : 20}km</span>
                    </span>
                    <input type="range" onChange={(e) => updateDistancePreference(e.target.value)} value={distance ? distance : 20} min={10} max={100} />
                </div>
                <div className={`${styles.range}`}>
                    <span>Age preference
                        <span>{minAge} - {maxAge}</span>
                    </span>
                    <div className={styles['age-slider']}>
                        {/* <input type="range" onChange={(e) => {setAge({min: +e.target.value, max: age.max}); updateAgePreference(+e.target.value, age?.max)}} value={age.min} min={18} max={age.max} /> 
                        <input type="range" onChange={(e) => {setAge({max: +e.target.value, min: age.min}); updateAgePreference(age?.min, +e.target.value)}} value={age.max} min={age.min} max={100} /> */}
                        <MultiRangeSlider
                            min={18}
                            max={85}
                            step={1}
                            minValue={minAge}
                            maxValue={maxAge}
                            onChange={(e: ChangeResult) => {
                                setMinAge(e.minValue);
                                setMaxAge(e.maxValue);
                                updateAgePreference(e.minValue, e.maxValue);
                            }}
                        />
                    </div>
                </div>
                <div style={{borderTop: 'none'}} className={styles.option}>
                    <span>Only show people from this range</span>
                    <label className={toggle.switch}>
                        <input checked={onlyFromAgeRange} onChange={(e) => {setOnlyAgeRange(e.target.checked); updateToggle('onlyFromAgeRange', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Global</span>
                    <label className={toggle.switch}>
                        <input checked={global} onChange={(e) => {setGlobal(e.target.checked); updateToggle('global', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <p>Going global will allow you to see people from around the world after you’ve run out of profiles nearby.</p>
            </div>
            {/* control visibility */}
            <div className={styles.division}>
                <h5>Control My Visibility</h5>
                <div className={styles.option}>
                    <span>Enable discovery</span>
                    <label className={toggle.switch}>
                        <input checked={discovery} onChange={(e) => {setDiscovery(e.target.checked); updateToggle('discovery', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Incognito mode</span>
                    <label className={toggle.switch}>
                        <input checked={incognitoMode} onChange={(e) => {setIncognitoMode(e.target.checked); updateToggle('incognitoMode', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <p>You will be discoverable only by people you Like in Incognito mode</p>
            </div>

            {/* privacy settings */}
            <div className={styles.division}>
                <h5>Privacy settings</h5>
                <div onClick={() => setEditSpace('blockedUsers')} className={styles.option}>
                    <span>blocked users</span>
                    <span>{rightIcon}</span>
                </div>
                {/* <div onClick={() => setEditSpace('blockedContacts')} className={styles.option}>
                    <span>blocked contacts</span>
                    <span>{rightIcon}</span>
                </div> */}
                {/* <div className={styles.option}>
                    <span>Recently active status</span>
                    <label className={toggle.switch}>
                        <input checked={recentActiveStatus} onChange={(e) => {setRecentActiveStatus(e.target.checked); updateToggle('recentActiveStatus', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div> */}
                <div className={styles.option}>
                    <span>Show my Age in profile</span>
                    <label className={toggle.switch}>
                        <input checked={showAge} onChange={(e) => {setShowAge(e.target.checked); updateToggle('showAge', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Show my Distance in profile</span>
                    <label className={toggle.switch}>
                        <input checked={showDistance} onChange={(e) => {setShowDistance(e.target.checked); updateToggle('showDistance', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
            </div>

            {/* profile settings */}
            <div className={styles.division}>
                <h5>Web profile</h5>
                <div className={styles.option}>
                    <span>username</span>
                    <span>{user?.username}</span>
                </div>
                <div className={styles.option}>
                    <span>Share My URL</span>
                    <span>{rightIcon}</span>
                </div>
            </div>

            {/* Message settings */}
            <div className={styles.division}>
                <h5>Message preference</h5>
                <div className={styles.option}>
                    <span>Only verified users can send message</span>
                    <label className={toggle.switch}>
                        <input checked={verfiedMessagesOnly} onChange={(e) => {setVerifiedMessagesOnly(e.target.checked); updateToggle('verifiedMessagesOnly', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Read receipts</span>
                    <label className={toggle.switch}>
                        <input checked={readReceipt} onChange={(e) => {setReadReceipt(e.target.checked); updateToggle('readReceipt', e.target.checked)}} type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
            </div>

            {/* footer */}
            <br />
            <div className={`${styles.footer}`}>
                <div className={styles.option}>
                    Share Zentangle <i className="fa-regular fa-paper-plane"></i>
                </div>
                <br />
                <div onClick={handleLogout} className={`${styles.logout} ${styles.option}`}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout 
                </div>
                <br className={styles.logout} />
                <div style={{borderBottom: 'none', color: 'orangered'}} className={styles.option}>
                    Delete Account <i className="fa-solid fa-trash"></i>
                </div>
            </div>
            {editSpace &&
            <div className={styles['edit-space']}>
                <span onClick={() => setEditSpace(null)} className={styles['edit-done']}>done</span>
                {editSpace === 'email' && user?.email?.email && <EditEmail email={user?.email?.email} />}
                {editSpace === 'phone' && user?.phone?.phone && <EditPhone phone={user?.phone?.phone} /> }
                {editSpace === 'password' && user?.password && <EditPassword password={user?.password} /> }
                {editSpace === 'blockedUsers' && <BlockedUsers /> }
            </div>
            }
        </div>
    )
}