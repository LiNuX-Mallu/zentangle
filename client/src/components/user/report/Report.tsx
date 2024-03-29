import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './Report.module.scss';
import Swal from 'sweetalert2';
import axios from '../../../instances/axios';

interface Props {
    isVisible: boolean;
    close: React.Dispatch<React.SetStateAction<boolean>>;
    username: string | undefined;
}

export default function Report({isVisible, close, username}: Props) {
    const [show, setShow] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [reason, setReason] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setShow(isVisible);
        return () => setShow(false);
    }, [isVisible]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            close(false);
        }, 300)
    }

    const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length) {
            const newImages = Array.from(files) as File[];
            setSelectedImages((pre) => [...pre, ...newImages.slice(0, 5 - selectedImages.length)]);
        }
    }

    const handleSubmit = () => {
        if (reason.trim().length < 100) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-start",
                showConfirmButton: false,
                timer: 3000,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              return Toast.fire({
                icon: "error",
                title: "Should have atleast 100 characters",
                background: 'black',
                color: 'salmon',
                iconColor: 'salmon',
              });
        }
        if (!username) return;

        const formData = new FormData();
        selectedImages.forEach((image) => formData.append('images', image));
        formData.append('against', username);
        formData.append('reason', reason);

        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
        axios.post('/user/report', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            if (response.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Report submitted",
                    color: 'white',
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: true,
                    background: 'black',
                }).then(() => close(false)).finally(() => Swal.close());
            }
        }).finally(() => Swal.close());
    }

    if (!username) return null;

    return (
        <div className={`${styles.report} ${show ? styles.visible : ''}`}>
            <span className={styles.close} onClick={handleClose}>Cancel</span>
            <i className={`${styles.icon} fa-solid fa-shield-halved`}></i>
            <h4>Report</h4>
            <div className={styles.media}>
                <input onChange={handleAddImage} type="file" multiple hidden ref={inputRef} />
                <div className={styles.images}>
                    {Array.from({length: 5}).map((_, index) => (
                        <div className={styles.image}>
                            {index < selectedImages.length ? <img src={URL.createObjectURL(selectedImages[index])} /> : 
                            <i onClick={() => inputRef.current ? inputRef.current.click() : false} className="fa-solid fa-file-circle-plus"></i>}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.reason}>
                <p>Explain the reason</p>
                <textarea onChange={(e) => setReason(e.target.value)} value={reason} placeholder='Explain why you want to report this person' rows={7}></textarea>
            </div>
            <div className={styles.submit}>
                <button onClick={handleSubmit}>Report</button>
            </div>
        </div>
    )
}