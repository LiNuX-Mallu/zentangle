import { useEffect, useRef, useState } from 'react';
import styles from './Verification.module.css';
import Swal from 'sweetalert2';
import axios from '../../../instances/axios';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}


export default function Verification({setSpace}: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [countDown, setCountDown] = useState(10);

    useEffect(() => {
        let mediaStream: MediaStream;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream: MediaStream) => {
            mediaStream = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0 && videoRef.current) {
                    Swal.fire({
                        title: "Submit this video for verification?",
                        icon: "question",
                        backdrop: true,
                        background: 'black',
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Submit it",
                        cancelButtonText: "No, Retake video"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const formData = new FormData();
                            formData.append('file', event.data, 'verification.webm');
                            axios.post('/user/request-verification', formData, {
                                headers: {'Content-Type': 'multipart/form-data'},
                            }).then((response) => {
                                if (response.status === 200) {
                                    Swal.fire({
                                        title: "Submitted",
                                        text: "Verification process will take upto 24 hours",
                                        icon: "success",
                                        backdrop: true,
                                        background: 'black',
                                    }).then(() => setSpace('account'));
                                }
                            });
                        }
                    });
                }
            };

            setMediaRecorder(recorder);
        });
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        }
    }, [setSpace]);

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setRecording(true);
        }

        let count = countDown;

        const interval = setInterval(() => {
            setCountDown((pre) => pre - 1);
            count--;
            if (count === 0) {
                clearInterval(interval);
                stopRecording();
            }
        }, 1000)
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
            setCountDown(10);
        }
    };

    return (
        <div className={styles.container}>
            <span onClick={() => setSpace('account')} className={styles.goback}>Go back</span>
            <video ref={videoRef} muted playsInline></video>
            {recording === false && <span onClick={startRecording} className={styles.ready}>Ready?</span>}
            {recording === true && 
                <div className={styles.description}>
                    <p><span>{countDown}</span> Show your whole face</p>
                </div>
            }
        </div>
    )
}