import './Login.css';
import closeIcon from '../../../assets/images/close-icon.png';
import { FormEvent, useEffect, useState } from 'react';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';

interface Props {
    cancel: React.Dispatch<React.SetStateAction<boolean>>;
    signup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({cancel, signup}: Props) {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [tooltip, setTooltip] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<undefined | string>(undefined)


    function containerCLick() {
        setTooltip(false);
        setLoginSuccess(false)
    }

    useEffect(() => {
        document.body.addEventListener('click', containerCLick);

        return () => {
            document.body.removeEventListener('click', containerCLick);
        }
    }, [tooltip, loginSuccess])

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const formData = {
            username,
            password,
        }

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
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response.data.message);
                setTooltip(true);
            } else {
                alert("Internal server error");
            }
        });
    }

    return (
        <div id="overlay" className="overlay container-fluid">
            {loginSuccess && <div className='logged'>Login Successful</div>}
            <form onSubmit={handleSubmit}>
                <div className='close-btn'>
                    <img src={closeIcon} alt="close" onClick={() => cancel(false)} />
                </div>
                <span className='heading'>Login here</span>
                {tooltip && error && <div className="tooltip-error">{error}</div>}
                <div>
                    <label htmlFor="username">Username</label>
                    <input style={{textTransform: 'lowercase'}} value={username} onChange={(e) => setUsername(e.target.value)} id="username" required />
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} id="password" required />
                </div>
                <div className='show-pass'>
                    <label htmlFor='showPass'>
                        <input type='checkbox' id='showPass' onChange={() => setShowPass(!showPass)} />
                        Show password
                    </label>
                </div>
                <div className='submit'>
                    <button type='submit'>Login</button>
                </div>
                <span style={{cursor: 'pointer'}} onClick={() => {cancel(false); signup(true)}} className='login'>
                    Don't have an account?
                </span>
            </form>
        </div>
    )
}