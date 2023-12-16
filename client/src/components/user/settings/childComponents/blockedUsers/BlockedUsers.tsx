import { useEffect, useState } from 'react';
import styles from './style.module.css';
import axios from '../../../../../instances/axios';
import { ApiUrl } from '../../../../../instances/urls';

interface Item {
    username: string,
    picture: string,
}

export default function BlockedUsers() {
    const [list, setList] = useState<Item[] | null>(null);

    useEffect(() => {
        if (list) return;
        axios.get('/user/get-blocked/users')
        .then((response) => {
            if (response.status === 200) {
                setList(response?.data)
            }
        });
    }, [list]);

    const handleUnblock = (username: string) => {
        if (!username) return;
        axios.post('/user/unblock', {who: username, where: 'users'}, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status === 200) {
                setList(null);
            }
        });
    }

    return (
        <div className={styles.container}>
            <h6 className='pb-2'>Blocked users</h6>
            {list && list.map((user: Item) => {
                return (
                    <div key={user.username} className={styles.item}>
                        <div className={styles['picture-container']}>
                            <img src={`${ApiUrl}/media/${user.picture}`} alt="profile" />
                        </div>
                        <span className={styles.name}>{user.username}</span>
                        <div className={styles.btn}>
                            <button onClick={() => handleUnblock(user.username)}>Unblock</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}