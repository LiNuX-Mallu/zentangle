import './Signup.css';
import closeIcon from '../../../assets/images/close-icon.png';
import { FormEvent, useEffect, useState } from 'react';
import axios from '../../../instances/axios';

interface Props {
    cancel: React.Dispatch<React.SetStateAction<boolean>>;
    login: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Signup({cancel, login}: Props) {
    const [showPass, setShowPass] = useState(false);
    const [tooltip, setTooltip] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [countryCode, setCountryCode] = useState("91");
    const [gender, setGender] = useState("male");

    const [usernameError, setUsernameError] = useState<undefined | string>(undefined);
    const [emailError, setEmailError] = useState<undefined | string>(undefined);
    const [firstnameError, setFirstnameError] = useState<undefined | string>(undefined);
    const [lastnameError, setLastnameError] = useState<undefined | string>(undefined);
    const [passwordError, setPasswordError] = useState<undefined | string>(undefined);
    const [phoneError, setPhoneError] = useState<undefined | string>(undefined);
    const [dobError, setDobError] = useState<undefined | string>(undefined);

    function containerCLick() {
        setTooltip(false);
        setLoginSuccess(false);
    }

    useEffect(() => {
        document.body.addEventListener('click', containerCLick);

        return () => {
            document.body.removeEventListener('click', containerCLick);
        }
    }, [tooltip])

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const formData = {
            username,
            firstname,
            lastname,
            email,
            phone,
            password,
            countryCode,
            dob,
            gender,
        }

        axios.post('/user/register', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status === 200) {
                setLoginSuccess(true);
                setTimeout(() => {
                    cancel(false);
                    login(true);
                }, 1000)
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                const errors = error?.response?.data?.errors;
                setUsernameError(errors?.username);
                setFirstnameError(errors?.firstname);
                setLastnameError(errors?.lastname);
                setEmailError(errors?.email);
                setPhoneError(errors?.phone);
                setDobError(errors?.dob);
                setPasswordError(errors?.password);
                setTooltip(true);
            } else {
                alert("Internal server error");
            }
        });
    }

    return (
        <div id="overlay" className="overlay container-fluid">
            {loginSuccess && <div className="logged">Registration Successful</div>}
            <form onSubmit={handleSubmit}>
                <div className='close-btn'>
                    <img src={closeIcon} alt="close" onClick={() => cancel(false)} />
                </div>
                <span className='heading'>Register here</span>
                <div>
                    <label htmlFor="username">Username</label>
                    <input style={{textTransform: 'lowercase'}} value={username} onChange={(e) => setUsername(e.target.value)} id="username" required />
                    {usernameError && tooltip && <div className="tooltip-error">{usernameError}</div>}
                </div>
                <div className='names'>
                    <div>
                        <label htmlFor='firstname'>Firstname</label>
                        <input value={firstname} onChange={(e) => setFirstname(e.target.value)} id='firstname' required />
                    </div>
                    <div>
                        <label htmlFor='lastname'>Lastname</label>
                        <input value={lastname} onChange={(e) => setLastname(e.target.value)} id='lastname' required />
                    </div>
                    {(tooltip && (firstnameError || lastnameError)) ? <div className='tooltip-error'>{firstnameError ? firstnameError : lastnameError}</div>: ""}
                </div>
                <div className='dob-gender'>
                    <div>
                        <label htmlFor='gender'>Gender</label>
                        <select onChange={(e) => setGender(e.target.value)} id='gender'>
                            <option selected value='male'>Male</option>
                            <option value='female'>Female</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor='dob'>Date for birth</label>
                        <input value={dob} type='date' onChange={(e) => setDob(e.target.value)} id='dob' required />
                    </div>
                    {tooltip && dobError && <div style={{width: 'auto'}} className="tooltip-error">{dobError}</div>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input style={{textTransform: 'lowercase'}} value={email} onChange={(e) => setEmail(e.target.value)} id="email" required />
                    {tooltip && emailError && <div className='tooltip-error'>{emailError}</div>}
                </div>
                <div className='row'>
                    <label htmlFor='phone'>Phone</label>
                    <div className='d-flex flex-row gap-1'>
                        <select onChange={(e) => setCountryCode(e.target.value)} className='col-3 col-lg-2'>
                            <option value='91'>+91</option>
                        </select>
                        <input className='col-9 col-lg-10' value={phone} onChange={(e) => setPhone(e.target.value)} id='phone' required/>
                        {tooltip && phoneError && <div className="tooltip-error">{phoneError}</div> }
                    </div>
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} id="password" required />
                    {tooltip && passwordError && <div className="tooltip-error">{passwordError}</div> }
                </div>
                <div className='show-pass'>
                    <label htmlFor='showPass'>
                        <input type='checkbox' id='showPass' onChange={() => setShowPass(!showPass)} />
                        Show password
                    </label>
                </div>
                <div className='submit'>
                    <button type='submit'>Signup</button>
                </div>
                <span style={{cursor: 'pointer'}} onClick={() => {cancel(false); login(true)}} className='login'>
                    Already have an account?
                </span>
            </form>
        </div>
    )
}