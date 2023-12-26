import styles from './Panel.module.css';
import menuIcon from '../../../assets/images/menu-icon.png';
import powerIcon from '../../../assets/images/power-icon.png';
import { useEffect, useState } from 'react';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Users from '../../../components/admin/users/Users';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import VerificationRequest from '../../../components/admin/verification-request/VerificationRequest';
import UserReports from '../../../components/admin/reports/userReports';

interface Props {
    defaultSession?: string;
}

export default function Panel({defaultSession}: Props) {
    const [menuActive, setMenuActive] = useState(false);
    const [session, setSession] = useState(defaultSession ?? 'users');
    const navigate = useNavigate();

    useEffect(() => setSession(defaultSession ?? 'users'), [defaultSession]);

    const handleLogout = () => {
        axios.post('/admin/logout')
        .then(response => {
            if (response.status === 200) navigate('/admin/login');
        }).catch(error => {
            alert(error.message);
        });
    }

    return (
        <div className={`container-fluid ${styles.container} row`}>
            <nav className={styles.navbar}>
                <div onClick={() => setMenuActive(!menuActive)} className={styles['menu-icon']}>
                    <img src={menuIcon} alt="menu" />
                </div>
                
                <div className={styles.brand}> <h4>Admin Panel&nbsp;<i className="fa-solid fa-user-tie"></i></h4></div>
                <div onClick={handleLogout}>
                    <span>Logout</span>
                    <img src={powerIcon} />
                </div>
            </nav>
            <div className={`${styles.sidebar} col-12 col-lg-3 ${menuActive ? styles['sidebar-active'] : ''}`}>
                <Sidebar session={session} setMenuActive={setMenuActive} />
            </div>
            <div className={`${styles.space} col-12 col-lg-9`}>
                {session === 'users' && <Users />}
                {session === 'verifications' && <VerificationRequest /> }
                {session === 'reports' && <UserReports /> }
            </div>
        </div>
    )
}