import { useState } from 'react';
import styles from './EditPhone.module.css';
import axios from '../../../../../instances/axios';

interface Props {
    //setEditSpace: React.Dispatch<React.SetStateAction<string | null>>;
    phone: number;
}

export default function EditPhone({phone}: Props) {
    const [newPhone, setNewPhone] = useState(phone);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        setSuccess(null);
        axios.put('/user/update-settings', {where: 'phone', what: newPhone}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setSuccess("Phone number changed successfully")
            }
        })
        .catch((error) => {
            if (error?.response?.status === 400) {
                setError("Invalid phone number");
                return;
            }
            alert("Internal server error");
        });
    }
    return (
        <div className={styles.container}>
            <h5>Change Phone number</h5>
            <input value={newPhone} onChange={(e) => setNewPhone(+e.target.value)} />
            <button onClick={handleSubmit}>Change</button>
            {success && <span className={styles.success}>{success}</span>}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}