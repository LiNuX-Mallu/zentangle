import { FormEvent, useState } from "react";
import styles from "./VerifyOtp.module.scss";
import axios from "../../../instances/axios";
import Swal from "sweetalert2";

interface Props {
    address: { email?: string };
    verify: React.Dispatch<React.SetStateAction<object | null>>;
    login: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VerifyOtp({ address, verify, login }: Props) {
    const [timer, setTimer] = useState<number | null>(null);
    const [message, setMessage] = useState(`OTP send to ${address.email}`);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);

    function countDown() {
        let count = 15;
        setTimer(count);
        const interval = setInterval(() => {
            if (count <= 0) {
                setTimer(null);
                clearInterval(interval);
            } else {
                count--;
                setTimer(count);
            }
        }, 1000);
    }

    const handleResend = () => {
        setMessage("");
        setError(null);
        countDown();
        axios
            .post(
                "/user/resend-otp",
                { email: address.email },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setMessage(response.data?.message);
                }
            });
    };

    const handleVerify = (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage("");
        if (otp.trim() === "") {
            setError("OTP required!");
            return;
        }
        axios.post('/user/verify-otp', {otp, email: address.email}, {
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.status === 200) {
                Swal.fire({
                    title: 'Verification success',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    verify(null);
                    login(true);
                });
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response?.data?.message)
            }
        })
    }

    return (
        <div className={styles.overlay}>
            <form onSubmit={handleVerify} className={styles["ver-form"]}>
                <h5>Verify {address.email ? "Email" : "Phone"}</h5>
                {error === null && <p>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
                <input maxLength={6} value={otp} onChange={(e) => {(/^[0-9]+$/.test(e.target.value) || e.target.value === '') && setOtp(e.target.value)}} type="text" placeholder="Enter OTP here" />
                <div className={styles.resend}>
                    <span>Didn't receive OTP?</span>
                    <span
                        onClick={handleResend}
                        className={timer ? styles.disabled : styles.btn}
                    >
                        {timer ? timer + "s Resend" : "Resend"}
                    </span>
                </div>
                <button className={styles.submit}>
                    Verify
                </button>
            </form>
        </div>
    );
}
