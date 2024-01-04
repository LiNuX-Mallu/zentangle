import { useState } from "react";
import Navbar from "../../../components/user/navbar/Navbar";
import Signup from "../../../components/user/signup/Signup";
import Login from "../../../components/user/login/Login";
import styles from "./Home.module.css";
import VerifyOtp from "../../../components/user/verifyOtp/VerifyOtp";

export default function Home() {
  const [isSignUp, setIsSignup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isVerify, setIsVerify] = useState<object | null>(null);

  return (
    <div className={`${styles.home} container-fluid`}>
      <Navbar login={setIsLogin} />
      <div className={styles.main}>
        <h1 className={styles.head}>Have a confidant with zentangle</h1>
        <button className={styles["join-now"]} onClick={() => setIsSignup(true)}>
          Join now
        </button>
      </div>
      {isSignUp && (
        <Signup verify={setIsVerify} signup={setIsSignup} login={setIsLogin} />
      )}
      {isLogin && <Login cancel={setIsLogin} signup={setIsSignup} />}
      {isVerify && <VerifyOtp login={setIsLogin} verify={setIsVerify} address={isVerify} />}
    </div>
  );
}
