import { useState } from 'react';
import styles from './EditPassword.module.css';
import axios from '../../../../../instances/axios';

interface Props {
    //setEditSpace: React.Dispatch<React.SetStateAction<string | null>>;
    password: string;
    email: string;
}

export default function EditPassword({password, email}: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pass, setPass] = useState(password);

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        setSuccess(null);
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (currentPassword !== pass) {
            setError("Invalid current password");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Confirm password doesn't match");
            return;
        }
        
        if (!passRegex.test(newPassword)) {
            setError("Password must be atleast 8 characters long with one lowercase, uppercase, special character and number");
            return;
        }

        axios.put('/user/update-settings', {where: 'password', what: newPassword}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setSuccess("Password changed successfully")
            }
        })
        .catch(() => {
            alert("Internal server error");
        });
    }

    const handleForgotPass = () => {
        if (!email) return;
        setError(null);
        axios.post('/user/forgot-password', {username: email}, {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            if (response.status === 200) {
                setSuccess(response.data?.message);
                axios.get('/user/get-details').then((res) => setPass(res.data.password));
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response.data.message);
            }
        });
    }

    return (
        <div className={styles.container}>
            <h5>Change Password</h5>
            <div className={styles.form}>
                <label>Current password</label>
                <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className={styles.form}>
                <label>New password</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className={styles.form}>
                <label>Confirm new password</label>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button onClick={handleSubmit}>Change</button>
            {success && <span className={styles.success}>{success}</span>}
            {error && <span className={styles.error}>{error}</span>}
            <span onClick={handleForgotPass} className={styles.forgot}>Forgot password?</span>
        </div>
    )
}