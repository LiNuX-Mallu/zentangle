import { useEffect, useState } from 'react';
import styles from './Users.module.css';
import { ProfileInterface } from '../../../instances/interfaces';
import axios from '../../../instances/axios';
import Swal from 'sweetalert2';
import ViewUser from '../viewUser/ViewUser';
import ogAxios from 'axios';

export default function Users() {
    const [data, setData] = useState<ProfileInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewProfile, setViewProfile] = useState<ProfileInterface | null>(null);
    const [searchData, setSearchData] = useState<ProfileInterface[]>([]);
    const [searching, setSearching] = useState("");
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        axios.get(`/admin/get-users/${currentPage}/${filter}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        }).catch(error => {
            alert(error?.message || "Internal server error");
        });
    }, [currentPage, filter]);

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

    const handleUnverify = (userId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: `This action will Unverify User Account`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "orangered",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
            position: 'center',
        }).then((result) => {
            if (!result.isConfirmed) return;
            axios.post('/admin/unverify-user', {userId}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        title: "Success",
                        icon: "success"
                    }).then(() => {
                        setSearching("");
                        setSearchData([]);
                        axios.get(`/admin/get-users/${currentPage}/${filter}`).then((res) => setData(res.data));
                    });
                }
            });
        });
    }

    useEffect(() => {
        if (searching.length === 0) {
            setSearchData([]);
            return;
        }
        const cancelToken = ogAxios.CancelToken.source();

        axios.get(`/admin/search-users/${searching}/${filter}`, {cancelToken: cancelToken.token})
        .then((response) => {
            if (response.status === 200) {
                setSearchData(response.data);
            }
        });

        return () => cancelToken.cancel();
        
    }, [searching, filter]);

    return (
        <div onClick={() => {
            if (viewProfile) {
                setViewProfile(null);
            }
        }} className={styles.container}>
            {viewProfile !== null &&
                <div onClick={(e) => e.stopPropagation()} className={styles.overlay}>
                    <ViewUser defaultProfile={viewProfile} />
                </div>
            }
            <h4 className='text-dark'>Users Management</h4>
            <div className={styles.search}>
                <input onChange={(e) => setSearching(e.target.value)} value={searching} placeholder="Search email, name or username" type="text" />

                <select onChange={(e) => {setCurrentPage(1), setFilter(e.target.value)}}>
                    <option defaultChecked={true} value="all">All Users</option>
                    <option value="verified">Verified Users</option>
                </select>
            </div>
            <div className={styles['table-container']}>
                <table className={styles.data}>
                    <thead>
                        <tr>
                            <th>Fullname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th className={styles['action-head']}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searching.length !== 0 && searchData?.map((user) => {
                            return (
                                <tr key={user._id} className={styles.user}>
                                    <td style={{textTransform: 'capitalize'}}>{user.firstname  +' '+ user.lastname}</td>
                                    <td style={{textTransform: 'capitalize'}}>{user.username}</td>
                                    <td>{user.email.email}</td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => handleBan(user.username, user.banned)} style={{backgroundColor: user.banned ? 'green' : ''}}>{user.banned ? 'Unban' : 'Ban'}</button>
                                        <button onClick={() => setViewProfile(user)} style={{backgroundColor: 'yellowgreen'}}>View</button>
                                        <button onClick={() => handleUnverify(user._id)} disabled={user.accountVerified !== 'verified'} style={{backgroundColor: user.accountVerified === 'verified' ? 'skyblue' : 'gray', color: 'white'}}>Unverify</button>
                                    </td>
                                </tr>
                            )
                        })}

                        {searching.length === 0 && data?.map((user) => {
                            return (
                                <tr key={user._id} className={styles.user}>
                                    <td style={{textTransform: 'capitalize'}}>{user.firstname  +' '+ user.lastname}</td>
                                    <td style={{textTransform: 'capitalize'}}>{user.username}</td>
                                    <td>{user.email.email}</td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => handleBan(user.username, user.banned)} style={{backgroundColor: user.banned ? 'green' : ''}}>{user.banned ? 'Unban' : 'Ban'}</button>
                                        <button onClick={() => setViewProfile(user)} style={{backgroundColor: 'yellowgreen'}}>View</button>
                                        <button onClick={() => handleUnverify(user._id)} disabled={user.accountVerified !== 'verified'} style={{backgroundColor: user.accountVerified === 'verified' ? 'skyblue' : 'gray', color: 'white'}}>Unverify</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {(data.length === 0 || (searching.length !== 0 && searchData.length === 0)) &&
                <h2 className='text-center p-5'>No data found!</h2>
            }
            
            {searching.length === 0 &&
            <div className={styles['page-buttons']}>
                <div>
                    <button onClick={() => setCurrentPage(currentPage-1 !== 0 ? currentPage - 1 : currentPage)}>{'previos'}</button>
                    <span>{currentPage}</span>
                    <button onClick={() => setCurrentPage(data.length ? currentPage+1 : currentPage)}>{'next'}</button>
                </div>
            </div>
            }
        </div>
    )
}