import { useEffect, useState } from 'react';
import styles from './VerificationRequest.module.css';
import { ProfileInterface } from '../../../instances/interfaces';
import axios from '../../../instances/axios';
import ViewUser from '../viewUser/ViewUser';
import { ApiUrl } from '../../../instances/urls';
import Swal from 'sweetalert2';

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

    useEffect(() => {
        axios.get(`/admin/get-verifications/${currentPage}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
                console.log(response.data);
            }
        })
    }, [currentPage]);

    const handleReject = (requestId: string, verify: boolean) => {
        Swal.fire({
            title: "Are you sure?",
            text: `This action will Reject Verification`,
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
                            <th>Request ID</th>
                            <th>Uploaded Video</th>
                            <th>User Profile</th>
                            <th className={styles['action-head']}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((request) => {
                            return (
                                <tr key={request.id} className={styles.user}>
                                    <td>{request.id.slice(-7, -1)}</td>
                                    <td className={styles['other-btn']}> <span onClick={() => setPlayVideo(`${ApiUrl}/media/verification/${request.doc}`)}>Play</span> </td>
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
            {data.length === 0 && <h2 className='text-center p-5'>No data found!</h2>}
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