import styles from './Login.module.css';
import closeIcon from '../../../assets/images/close-icon.png';
import { FormEvent, useState } from 'react';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Props {
    cancel: React.Dispatch<React.SetStateAction<boolean>>;
    signup: React.Dispatch<React.SetStateAction<boolean>>;
    verify: React.Dispatch<React.SetStateAction<object | null>>;
}

export default function Login({cancel, signup, verify}: Props) {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [tooltip, setTooltip] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<undefined | string>(undefined)


    function containerCLick() {
        setTooltip(false);
        setLoginSuccess(false);
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const formData = {
            username,
            password,
        }
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
        axios.post('/user/login', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status === 200) {
                setLoginSuccess(true);
                setTimeout(() => {
                    navigate('/app');
                }, 1000);
            } else if (response.status === 202) {
                cancel(false);
                verify({email: response.data?.email, username, password});
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response.data.message);
                setTooltip(true);
            } else {
                alert("Internal server error");
            }
        }).finally(() => Swal.close());
    }
    
    const handleForgotPass = () => {
        setPassword("");
        if (username.trim() === "") {
            console.log(username)
            setError("Please provide username or registered email");
            setTooltip(true);
            return;
        }
        axios.post('/user/forgot-password', {username: username.trim()}, {
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            if (response.status === 200) {
                Swal.fire({
                    text: response.data?.message,
                    backdrop: true,
                    background: 'black',
                    showConfirmButton: true,
                    confirmButtonText: 'Got it',
                    color: 'white',
                    icon: 'info',
                });
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response.data.message);
                setTooltip(true);
            }
        });
    }

    return (
        <div onClick={containerCLick} className={`${styles.overlay} container-fluid`}>
            {loginSuccess && <div className={styles['logged']}>Login Successful</div>}
            <form className={styles['log-form']} onSubmit={handleSubmit}>
                <div className={styles['close-btn']}>
                    <img src={closeIcon} alt="close" onClick={() => cancel(false)} />
                </div>
                <span className={styles['heading']}>Login here</span>
                {tooltip && error && <div className={styles["tooltip-error"]}>{error}</div>}
                <div>
                    <label htmlFor="username">Username</label>
                    <input style={{textTransform: 'lowercase'}} value={username} onChange={(e) => setUsername(e.target.value)} id="username" required />
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} id="password" required />
                </div>

                <div className={styles['show-pass']}>
                    <label htmlFor='showPass'>
                        <input type='checkbox' id='showPass' onChange={() => setShowPass(!showPass)} />
                        Show password
                    </label>
                    <span onClick={(e) => {handleForgotPass(); e.stopPropagation()}}>Forgot password?</span>
                </div>

                <div className={styles['submit']}>
                    <button type='submit'>Login</button>
                </div>
                <span style={{cursor: 'pointer'}} onClick={() => {cancel(false); signup(true)}} className={styles['login']}>
                    Don't have an account?
                </span>
            </form>
        </div>
    )
}