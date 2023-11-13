import styles from './Settings.module.css';
import homeIcon from '../../../assets/images/home-icon.png';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Settings({setSpace}: Props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/user/logout')
        .then(response => {
            if (response.status === 200) navigate('/home');
        }).catch(() => alert("Internal server error"));
    }
    return(
        <div className={styles.settings}>
            <div className={styles.topbar}>
                <img onClick={() => setSpace('home')} src={homeIcon} />
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}