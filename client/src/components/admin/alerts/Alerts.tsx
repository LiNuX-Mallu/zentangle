import { useEffect, useState } from 'react';
import styles from './Alerts.module.scss';
import axios from '../../../instances/axios';
import formatDate from '../../../instances/formatDate';
import Swal from 'sweetalert2';
import { Alert } from './alertType';


export default function Alerts() {
    const [data, setData] = useState<Alert[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [reload, setReload] = useState(Date.now().toString());

    useEffect(() => {
        setLoading(true);
        axios.get(`/admin/get-alerts/${currentPage}/${isActive}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        }).finally(() => setLoading(false));
    }, [currentPage, isActive, reload]);

    const handleAdd = () => {
        Swal.fire({
            title: "Enter title",
            input: 'text',
            inputPlaceholder: 'Enter title here...',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) return "Title cannot be Empty";
            }
        }).then((res) => {
            if (res.isConfirmed) {
                const title = res.value;
                Swal.fire({
                    title: "Enter content",
                    input: 'textarea',
                    inputPlaceholder: 'Enter content here...',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (value.length < 30) return "Must have atleast 30 characters";
                    }
                }).then((res) => {
                    if (res.isConfirmed) {
                        const content = res.value;
                        axios.post('/admin/add-alert', {title, content}, {
                            headers: {'Content-Type': 'application/json'}
                        }).then((response) => {
                            if (response.status === 200) {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                }).then(() => setReload(Date.now().toString()))
                            }
                        })
                    }
                })
            }
        })
    };

    const editAlert = (alertId: string, text: string, where: string) => {
        Swal.fire({
            title: `Edit ${where}`,
            input: where === 'title' ? 'text' : 'textarea',
            inputPlaceholder: 'Enter content here...',
            inputValue: text,
            showCancelButton: true,
            inputValidator: (value) => {
                if (where === 'title' && !value) return "Cannot be empty";
                else if (where === 'content' && value.length < 30) return "Must have atleast 30 characters";
            }
        }).then((res) => {
            if (res.isConfirmed) {
                axios.put('/admin/edit-alert', {data: res.value, where, alertId}, {
                    headers: {"Content-Type": 'application/json'}
                }).then((response) => {
                    if (response.status === 200) {
                        setReload(Date.now().toString());
                    }
                })
            }
        })
    };

    const handleStatus = (alertId: string, data: boolean) => {
        axios.put('/admin/edit-alert', {data, where: 'isActive', alertId}, {
            headers: {"Content-Type": 'application/json'}
        }).then((response) => {
            if (response.status === 200) {
                setReload(Date.now().toString());
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles['add-filter']}>
                <button onClick={handleAdd}>Add new <i className="fa-solid fa-plus"></i></button>
                <select onChange={(e) => {setCurrentPage(1), setIsActive(e.target.value === 'active')}}>
                    <option defaultChecked={true} value='active'>Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className={styles['table-container']}>
                <table className={styles.data}>
                    <thead>
                        <tr>
                            <th>Created At</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th className={styles['action-head']}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && data?.map((alert) => {
                            return (
                                <tr key={alert._id} className={styles.alert}>
                                    <td>{formatDate(alert.timestamp)}</td>
                                    <td className={styles['other-btn']}> <span onClick={() => editAlert(alert._id, alert.title, 'title')}>{alert.title}</span></td>
                                    <td className={styles['other-btn']}> <span onClick={() => editAlert(alert._id, alert.content, 'content')}>{alert.content.slice(0, 20)} {alert.content.length > 20 ? '...' : ''}</span></td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => handleStatus(alert._id, !alert.isActive)} style={{backgroundColor: alert.isActive ? 'rgb(32, 184, 65)' : 'orangered'}}>{alert.isActive ? 'Active' : 'Inactive'}</button> 
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
            {(data.length === 0 || loading) &&
                <h2 className='text-center p-5'>{loading ? <i className="text-center fa-2xl p-5 fa-solid fa-spinner fa-spin"></i> : 'No data found!'}</h2>
            }

            <div className={styles['page-buttons']}>
                <div>
                    <button onClick={() => setCurrentPage(currentPage-1 !== 0 ? currentPage - 1 : currentPage)}>{'previos'}</button>
                    <span>{currentPage}</span>
                    <button onClick={() => setCurrentPage(data.length ? currentPage+1 : currentPage)}>{'next'}</button>
                </div>
            </div>
        </div>
    )
}