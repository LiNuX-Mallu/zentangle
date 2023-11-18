import styles from './Settings.module.css';
import toggle from './extra/toggle.module.css';
import homeIcon from '../../../assets/images/home-icon.png';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProfileInterface } from '../../../instances/interfaces';
import Loading from '../loading/Loading';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Settings({setSpace}: Props) {
    const navigate = useNavigate();
    const [user, setUser] = useState<ProfileInterface | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const rightIcon = <i className="fa-solid fa-angle-right"></i>;

    const [distance, setDistance] = useState("");
    const [age, setAge] = useState({min: 18, max: 30});

    const handleLogout = () => {
        axios.post('/user/logout')
        .then(response => {
            if (response.status === 200) navigate('/home');
        }).catch(() => alert("Internal server error"));
    }

    useEffect(() => {
        axios.get('/user/get-details')
        .then((response) => {
            if (response.status === 200) setUser(response.data);
        })
        .catch(() => alert("Internal server error"))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />
    return(
        <div className={styles.settings}>
            <div className={styles.topbar}>
                <img onClick={() => setSpace('home')} src={homeIcon} />
                <span onClick={() => setSpace('account')}><i className="fa-solid fa-angle-left"></i> Settings</span>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* account settings */}
            <div className={styles.division}>
                <h5>Account settings</h5>
                <div className={styles.option}>
                <span>Email</span>
                    <span>
                        {user && user?.email?.email}
                        {rightIcon}
                    </span>
                </div>
                <div className={styles.option}>
                <span>Phone</span>
                    <span>
                        {user && `+${user.phone.countryCode}  ${user?.phone?.phone}`}
                        {rightIcon}
                    </span>
                </div>
                <div className={styles.option}>
                    <span>Password</span>
                    <span>
                        {user && "*".repeat(user?.password.length)}
                        {rightIcon}
                    </span>
                </div>
            </div>

            {/* discovery settings */}
            <div className={styles.division}>
                <h5>Disovery settings</h5>
                <div className={styles.option}>
                    <span>Location</span>
                    <span>Loading {rightIcon}</span>
                </div>
                <div className={`${styles.range}`}>
                    <span>Distance preference
                        <span>{distance}km</span>
                    </span>
                    <input type="range" onChange={(e) => setDistance(e.target.value)} value={distance} min={10} max={100} />
                </div>
                <div className={`${styles.range}`}>
                    <span>Age preference
                        <span>{age.min} - {age.max}</span>
                    </span>
                    <div className={styles['age-slider']}>
                        <input type="range" onChange={(e) => setAge({min: Number(e.target.value), max: age.max})} value={age.min} min={18} max={age.max - 1} /> 
                        <input type="range" onChange={(e) => setAge({max: Number(e.target.value), min: age.min})} value={age.max} min={age.min + 1} max={100} />
                    </div>
                </div>
                <div style={{borderTop: 'none'}} className={styles.option}>
                    <span>Only show people from this range</span>
                    <label className={toggle.switch}>
                        <input type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Global</span>
                    <label className={toggle.switch}>
                        <input type="checkbox" />
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
                        <input checked type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Incognito mode</span>
                    <label className={toggle.switch}>
                        <input type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <p>You will be discoverable only by people you Like in Incognito mode</p>
            </div>

            {/* privacy settings */}
            <div className={styles.division}>
                <h5>Privacy settings</h5>
                <div className={styles.option}>
                    <span>blocked users</span>
                    <span>{rightIcon}</span>
                </div>
                <div className={styles.option}>
                    <span>blocked contacts</span>
                    <span>{rightIcon}</span>
                </div>
                <div className={styles.option}>
                    <span>Recently active status</span>
                    <label className={toggle.switch}>
                        <input type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
            </div>

            {/* profile settings */}
            <div className={styles.division}>
                <h5>Web profile</h5>
                <div className={styles.option}>
                    <span>username</span>
                    <span>{rightIcon}</span>
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
                        <input type="checkbox" />
                        <span className={toggle.slider}></span>
                    </label>
                </div>
                <div className={styles.option}>
                    <span>Read receipts</span>
                    <label className={toggle.switch}>
                        <input type="checkbox" />
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
                <div className={`${styles.logout} ${styles.option}`}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout 
                </div>
                <br className={styles.logout} />
                <div style={{borderBottom: 'none', color: 'orangered'}} className={styles.option}>
                    Delete Account <i className="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>
    )
}