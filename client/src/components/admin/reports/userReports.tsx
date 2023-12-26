import { useEffect, useState } from 'react';
import styles from './userReports.module.scss';
import { ProfileInterface } from '../../../instances/interfaces';
import axios from '../../../instances/axios';
import ViewUser from '../viewUser/ViewUser';
import formatDate from '../../../instances/formatDate';
import ViewReport from './viewReport/ViewReport';

interface Report {
    status: string;
    id: string;
    complainer: ProfileInterface;
    complainee: ProfileInterface;
    complaint: string;
    timestamp: Date;
    images: string[];  
}

export default function UserReports() {
    const [data, setData] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewProfile, setViewProfile] = useState<ProfileInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewReport, setViewReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState('open');

    useEffect(() => {
        if (viewReport !== null) return;
        
        setLoading(true);
        axios.get(`/admin/get-reports/${currentPage}/${filter}`)
        .then(response => {
            if (response.status === 200) {
                setData(response.data);
                console.log(response.data);
            }
        }).finally(() => setLoading(false));
    }, [currentPage, filter, viewReport]);

    return (
        <div onClick={() => {
                if (viewProfile) setViewProfile(null);
                if (viewReport) setViewReport(null);
            }}
            className={styles.container}>

            {viewProfile !== null &&
                <div onClick={(e) => e.stopPropagation()} className={styles.overlay}>
                    <ViewUser defaultProfile={viewProfile} />
                </div>
            }
            {viewReport !== null && viewProfile === null &&
                <div onClick={(e) => e.stopPropagation()} className={styles.overlay}>
                    <ViewReport setViewReport={setViewReport} setViewProfile={setViewProfile} report={viewReport} />
                </div>
            }

            <div className={styles.filter}>
                <select onChange={(e) => {setCurrentPage(1), setFilter(e.target.value)}}>
                    <option defaultChecked={true} value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className={styles['table-container']}>
                <table className={styles.data}>
                    <thead>
                        <tr>
                            <th>Reported At</th>
                            <th>Complainer</th>
                            <th>Complainee</th>
                            <th className={styles['action-head']}>Complaint</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && data?.map((report) => {
                            return (
                                <tr key={report.id} className={styles.user}>
                                    <td>{formatDate(report.timestamp)}</td>
                                    <td className={styles['other-btn']}> <span onClick={() => setViewProfile(report.complainer)}>{report.complainer.username}</span> </td>
                                    <td className={styles['other-btn']}> <span onClick={() => setViewProfile(report.complainee)}>{report.complainee.username}</span> </td>
                                    <td className={styles['action-body']}>
                                        <button onClick={() => setViewReport(report)}>View</button>
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