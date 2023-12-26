import { useEffect } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    session: string;
    setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({session, setMenuActive}: Props) {
    const navigate = useNavigate();

    useEffect(() => {
        setMenuActive(false);
    }, [session, setMenuActive]);
    
    return (
        <div className={styles.container}>
            <div onClick={() => navigate('/admin/dashboard')} className={`${session === 'dashboard' ? styles.active : ''} ${styles.item}`}>
                <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/admin/users')} className={`${session === 'users' ? styles.active : ''} ${styles.item}`}>
                <span>Manage users</span>
            </div>
            <div onClick={() => navigate('/admin/reports')} className={`${session === 'reports' ? styles.active : ''} ${styles.item}`}>
                <span>Reports</span>
            </div>
            <div onClick={() => navigate('/admin/verifications')} className={`${session === 'verifications' ? styles.active : ''} ${styles.item}`}>
                <span>Verifications</span>
            </div>
            <div onClick={() => navigate('/admin/alerts-notifications')} className={`${session === 'alerts' ? styles.active : ''} ${styles.item}`}>
                <span>Alert & Notification</span>
            </div>
        </div>
    )
}