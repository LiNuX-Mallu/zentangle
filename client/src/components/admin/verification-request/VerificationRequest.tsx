import { useEffect, useState } from 'react';
import styles from './VerificationRequest.module.css';
import { ProfileInterface } from '../../../instances/interfaces';
import axios from '../../../instances/axios';
import ViewUser from '../viewUser/ViewUser';
import Swal from 'sweetalert2';
import formatDate from '../../../instances/formatDate';

interface Verification {
    id: string;
    requestedBy: ProfileInterface;
    requestedOn: Date;
    doc: string;
}

export default function VerificationRequest() {
    const [data, setData] = useState<Verification[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewProfile, setViewProfile] = useState<ProfileInterface | null>(null);
    const [playVideo, setPlayVideo] = useState<string| null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/admin/get-verifications/${currentPage}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
            }
        }).finally(() => setLoading(false));

    }, [currentPage]);

    const handleReject = (requestId: string, verify: boolean) => {
        Swal.fire({
            title: "Are you sure?",
            text: `This action will ${verify ? 'Approve' : 'Reject'} Verification`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "orangered",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
            position: 'center',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/admin/reject-verification', {requestId, verify}, {
                    headers: {'Content-Type': 'application/json'}
                })
                .then((response) => {
                    if (response.status === 200) {
                        axios.get('/admin/get-verifications/'+currentPage)
                        .then((res) => setData(res?.data));
                    }
                });
            }
        });
    }

    return (
        <div onClick={() => {
            if (viewProfile) setViewProfile(null);
            if (playVideo) setPlayVideo(null);
        }} className={styles.container}>
            {viewProfile !== null &&
                <div onClick={(e) => e.stopPropagation()} className={styles.overlay}>
                    <ViewUser defaultProfile={viewProfile} />
                </div>
            }
            {playVideo !== null &&
                <div onClick={(e) => e.stopPropagation()} className={styles.overlay}>
                    <video src={playVideo} playsInline autoPlay></video>
                </div>
            }
            <div className={styles['table-container']}>
                <table className={styles.data}>
                    <thead>
                        <tr>
                            <th>Requested At</th>
                            <th>Uploaded Video</th>
                            <th>User Profile</th>
                            <th className={styles['action-head']}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && data?.map((request) => {
                            return (
                                <tr key={request.id} className={styles.user}>
                                    <td>{formatDate(request.requestedOn)}</td>
                                    <td className={styles['other-btn']}> <span onClick={() => setPlayVideo(request?.doc)}>Play</span> </td>
                                    <td className={styles['other-btn']}> <span onClick={() => setViewProfile(request.requestedBy)}>View</span> </td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => handleReject(request.id, true)}>Approve</button>
                                        <button onClick={() => handleReject(request.id, false)} style={{backgroundColor: 'orangered'}}>Reject</button>
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