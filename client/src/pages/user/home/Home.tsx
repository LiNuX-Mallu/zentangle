import { useState } from "react";
import Navbar from "../../../components/user/navbar/Navbar";
import Signup from "../../../components/user/signup/Signup";
import Login from "../../../components/user/login/Login";
import './Home.css';

export default function Home() {
    const [isSignUp, setIsSignup] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    return(
        <div className="home container-fluid">
            <Navbar login={setIsLogin} />
            <div className="main">
                <h1 className="head">Have a confidant with zentangle</h1>
                <button className="join-now" onClick={() => setIsSignup(true)}>Join now</button>
            </div>
            {isSignUp && <Signup cancel={setIsSignup} login={setIsLogin} />}
            {isLogin && <Login cancel={setIsLogin} signup={setIsSignup} /> }
        </div>
    )
}