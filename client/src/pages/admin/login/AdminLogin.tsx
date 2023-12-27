import { useState } from 'react';
import styles from './AdminLogin.module.scss';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        axios.post('/admin/login', {username, password}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate('/admin');
            }
        }).catch(error => {
            alert(error);
        });
    }

    return (
        <div className={`container-fluid ${styles.container}`}>
            <div className={styles.form}>
                <h3>Admin Login</h3>
                <div>
                    <label>Username</label>
                    <input style={{textTransform: 'capitalize'}} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your username' />
                </div>
                <div>
                    <label>Password</label>
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' />
                </div>
                <div className={styles.showpass}>
                    <input type='checkbox' onChange={() => setShowPass(!showPass)} />
                    <label>show password</label>
                </div>
                <div className={styles.submit}>
                    <button onClick={handleSubmit}>Login</button>
                </div>
            </div>
        </div>
    )
}