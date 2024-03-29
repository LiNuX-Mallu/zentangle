import { FormEvent, useState } from "react";
import styles from "./VerifyOtp.module.scss";
import axios from "../../../instances/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { Address } from "../../../pages/user/home/Home";
interface Props {
    address: { email: string, username?: string, password?: string };
    verify: React.Dispatch<React.SetStateAction<Address | null>>;
    login: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VerifyOtp({ address, verify, login }: Props) {
    const [timer, setTimer] = useState<number | null>(null);
    const [message, setMessage] = useState(`OTP send to ${address.email}`);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
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
            ).then((response) => {
                if (response.status === 200) {
                    setMessage(response.data?.message);
                }
            }).catch(() => Swal.close())
            .finally(() => Swal.close());
    };

    const handleVerify = (event: FormEvent) => {
        event.preventDefault();
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
        setError(null);
        setMessage("");
        if (otp.trim() === "") {
            setError("OTP required!");
            Swal.close();
            return;
        }
        axios.post('/user/verify-otp', {otp, email: address.email}, {
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            Swal.close();
            if (response.status === 200) {
                Swal.fire({
                    title: 'Verification success',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    background: 'black',
                    color: 'white',
                }).then(() => {
                    Swal.fire({
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        background: 'transparent',
                        backdrop: true,
                    });
                    if (address.username && address.password) {
                        axios.post('/user/login', {username: address.username, password: address.password}, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                            if (response.status === 200) {
                                setTimeout(() => {
                                    navigate('/app');
                                }, 1000);
                            } else {
                                verify(null);
                                login(true);
                            }
                        }).finally(() => Swal.close());
                    } else {
                        verify(null);
                        login(true);
                    }
                }).finally(() => Swal.close());
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response?.data?.message)
            }
        }).finally(() => Swal.close());
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
