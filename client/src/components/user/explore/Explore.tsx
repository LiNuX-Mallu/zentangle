import styles from './Explore.module.scss';
import verifyMan from '../../../assets/images/verify-man.png';
import friendsPic from '../../../assets/images/friends.jpg';
import lovePic from '../../../assets/images/love.jpg';
import partyPic from '../../../assets/images/party.jpg';
import coffeePic from '../../../assets/images/coffee.jpg';
import { useNavigate } from 'react-router';

interface Props {
    setSpace: React.Dispatch<React.SetStateAction<string>>;
}

export default function Explore({setSpace}: Props) {
    const navigate = useNavigate();

    return (
        <div className={styles.explore}>
            <div className={styles.topbar}>
                <h4 onClick={() => innerWidth > 768 && navigate('/app')}>
                    <i className="fa-solid fa-angle-left"></i> 
                    Explore</h4>
            </div>
            <div className={styles.verified}>
                <img src={verifyMan} />
                <h3>Verified profiles <i className="fa-solid fa-circle-check"></i></h3>
                <div>
                    <p>See only verified profiles</p>
                    <span onClick={() => setSpace('verified')} className='fa-beat'>Try now</span>
                </div>
            </div>

            <h6 style={{color: 'white', paddingTop: '10%'}}>Others</h6>
            <div className={styles.others}>
                <div onClick={() => setSpace('freetonight')}>
                    <img src={partyPic} />
                    <span>Free Tonight?</span>
                </div>
                <div onClick={() => setSpace('befriends')}>
                    <img src={friendsPic} />
                    <span>Let's be Friends</span>
                </div>
                <div onClick={() => setSpace('forlove')}>
                    <img src={lovePic} />
                    <span>Looking for Love</span>
                </div>
                <div onClick={() => setSpace('coffeedate')}>
                    <img src={coffeePic} />
                    <span>Coffee Date</span>
                </div>
            </div>
        </div>
    )
}