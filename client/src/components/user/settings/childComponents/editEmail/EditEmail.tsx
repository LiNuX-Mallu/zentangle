import { useState } from 'react';
import styles from './EditEmail.module.css';
import axios from '../../../../../instances/axios';

interface Props {
    //setEditSpace: React.Dispatch<React.SetStateAction<string | null>>;
    email: string;
}

export default function EditEmail({email}: Props) {
    const [newEmail, setNewEmail] = useState(email);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        setSuccess(null);
        axios.put('/user/update-settings', {where: 'email', what: newEmail}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setSuccess("Email address changed successfully")
            }
        })
        .catch((error) => {
            if (error?.response?.status === 400) {
                setError("Invalid Email address");
                return;
            }
            alert("Internal server error");
        });
    }
    return (
        <div className={styles.container}>
            <h5>Change Email address</h5>
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <button onClick={handleSubmit}>Change</button>
            {success && <span className={styles.success}>{success}</span>}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}