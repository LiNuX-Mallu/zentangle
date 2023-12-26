import { useState } from 'react';
import { ProfileInterface } from '../../../../instances/interfaces';
import { ApiUrl } from '../../../../instances/urls';
import styles from './ViewReport.module.scss';
import axios from '../../../../instances/axios';
import Swal from 'sweetalert2';

export interface Report {
    status: string;
    id: string;
    complainer: ProfileInterface;
    complainee: ProfileInterface;
    complaint: string;
    timestamp: Date;
    images: string[];
}

interface Props {
    report: Report;
    setViewProfile: React.Dispatch<React.SetStateAction<ProfileInterface | null>>;
    setViewReport: React.Dispatch<React.SetStateAction<Report | null>>
}

export default function ViewReport({report, setViewProfile, setViewReport}: Props) {
    const [viewImage, setViewImage] = useState<number | null>(null);

    if (viewImage !== null) {
        return (
            <div onClick={() => setViewImage(null)} className={styles['view-image']}>
                <img onClick={(e) => e.stopPropagation()} src={ApiUrl+'/media/reports/'+report.images[viewImage]} />
            </div>
        )
    }

    const handleAction = () => {
        Swal.fire({
            title: "Are you sure?",
            text: `This action will Ban ${report.complainee.username}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "orangered",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
            position: 'center',
        }).then((res) => {
            if (res.isConfirmed) {
                Swal.fire({
                    didOpen: () => {
                      Swal.showLoading();
                    }
                })
                axios.post('/admin/report-action', {reportId: report.id}, {
                    headers: {'Content-Type': 'application/json'}
                }).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Success",
                            icon: "success",
                        }).then(() => setViewReport(null));
                    }
                })
            }
        });
    }

    return (
        <div className={styles.container}>
            <span onClick={() => setViewReport(null)} className={`${styles.back}`}><i className="fa-solid fa-angle-left"></i> back</span>

            <div className={styles.user}>
                <span>Complainer: {report.complainer.username}</span>
                <span onClick={() => setViewProfile(report.complainer)} className={styles['profile-btn']}>profile</span>
            </div>
            <div className={styles.user}>
                <span>Complainee: {report.complainee.username}</span>
                <span onClick={() => setViewProfile(report.complainee)} className={styles['profile-btn']}>profile</span>
            </div>

            <div className={styles.images}>
                {Array.from({length: 5}).map((_, index) => (
                    <div className={styles.image}>
                        {index < report.images.length ?
                            <img onClick={() => setViewImage(index)} src={ApiUrl+'/media/reports/'+report.images[index]} alt="" />
                            : 
                            <i className="fa-solid fa-file-circle-xmark"></i>
                        }
                    </div>
                ))}
            </div>

            <div className={styles.complaint}>
                <h6>Reason :</h6>
                <p>{report.complaint}</p>
            </div>

            {report.status === 'open' &&
                <div className={styles.action}>
                    <button onClick={handleAction}>Ban Complainee and send Email</button>
                </div>
            }
        </div>
    )
}  