import { useEffect, useState } from 'react';
import styles from './Users.module.css';
import { ProfileInterface } from '../../../instances/interfaces';
import axios from '../../../instances/axios';
import Swal from 'sweetalert2';

export default function Users() {
    const [data, setData] = useState<ProfileInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`/admin/get-users/${currentPage}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        }).catch(error => {
            alert(error?.message || "Internal server error");
        });
    }, [currentPage]);

    const handleBan = (username: string, banned: boolean) => {
        Swal.fire({
            title: "Are you sure?",
            text: `This action will ${banned ? 'unban' : 'ban'} ${username}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "orangered",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
            position: 'center',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/admin/ban-unban-user', {username}, {
                    headers: {
                        "Content-Type": 'application/json',
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Success",
                            icon: "success"
                        }).then(() => {
                            const newData = data.map((user) => {
                                if (user.username === username) return response.data;
                                else return user;
                            });
                            setData([...newData]);
                        });
                    }
                }).catch((error) => {
                    alert(error.message || "Internal server error");
                });
            }
          });
    }

    return (
        <div className={styles.container}>
            <div className={styles['table-container']}>
                <table className={styles.data}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th className={styles['action-head']}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((user) => {
                            return (
                                <tr key={user._id} className={styles.user}>
                                    <td style={{textTransform: 'capitalize'}}>{user.firstname}</td>
                                    <td style={{textTransform: 'capitalize'}}>{user.username}</td>
                                    <td>{user.email.email}</td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => handleBan(user.username, user.banned)} style={{backgroundColor: user.banned ? 'green' : ''}}>{user.banned ? 'Unban' : 'Ban'}</button>
                                        <button style={{backgroundColor: 'gray'}}>View</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && <h2 className='text-center p-5'>No data found!</h2>}
            <div className={styles['page-buttons']}>
                <div>
                    <button onClick={() => setCurrentPage(currentPage-1 !== 0 ? currentPage - 1 : currentPage)}>{'previos'}</button>
                    <span>{currentPage}</span>
                    <button onClick={() => setCurrentPage(currentPage+1)}>{'next'}</button>
                </div>
            </div>
        </div>
    )
}