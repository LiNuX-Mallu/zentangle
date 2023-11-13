import { useEffect } from 'react';
import styles from './Sidebar.module.css';

interface Props {
    setSession: React.Dispatch<React.SetStateAction<string>>;
    session: string;
    setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({setSession, session, setMenuActive}: Props) {
    useEffect(() => {
        setMenuActive(false);
    }, [session, setMenuActive]);
    return (
        <div className={styles.container}>
            <div onClick={() => setSession('dashboard')} className={`${session === 'dashboard' ? styles.active : ''} ${styles.item}`}>
                <span>Dashboard</span>
            </div>
            <div onClick={() => setSession('users')} className={`${session === 'users' ? styles.active : ''} ${styles.item}`}>
                <span>Manage users</span>
            </div>
            <div onClick={() => setSession('reports')} className={`${session === 'reports' ? styles.active : ''} ${styles.item}`}>
                <span>Reports</span>
            </div>
            <div onClick={() => setSession('verifications')} className={`${session === 'verifications' ? styles.active : ''} ${styles.item}`}>
                <span>Verifications</span>
            </div>
            <div onClick={() => setSession('alert')} className={`${session === 'alert' ? styles.active : ''} ${styles.item}`}>
                <span>Alert & Notification</span>
            </div>
        </div>
    )
}