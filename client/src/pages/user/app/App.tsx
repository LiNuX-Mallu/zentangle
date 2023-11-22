import './App.css';
import exploreIcon from '../../../assets/images/explore-icon.png';
import accountIcon from '../../../assets/images/account-icon.png';
import chatIcon from '../../../assets/images/chat-icon.png';
import homeIcon from '../../../assets/images/home-icon.png';
import startsIcon from '../../../assets/images/stars-icon.png';
import Profile from '../../../components/user/profile/Profile';
import Account from '../../../components/user/account/Account';
import AccountBig from '../../../components/user/accountBig/AccountBig';
import Settings from '../../../components/user/settings/Settings';
import Edit from '../../../components/user/editProfile/EditProfile';
import { useEffect, useState } from 'react';
import Loading from '../../../components/user/loading/Loading';
import useGeoLocation from '../../../hooks/useGeoLocation';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../../redux/actions/locationActions';

export default function App() {
    const [inMessage, setInMessage] = useState(false);
    const [space, setSpace] = useState('home');
    const [loading, setLoading] = useState(true);
    const {latitude, longitude, error} = useGeoLocation();
    const dispactch = useDispatch();

    useEffect(() => {
        if (latitude !== null && longitude !== null && !error) {
            dispactch(setLocation({latitude, longitude}));
        }
        const timeout = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timeout);
    }, [latitude, longitude, error, dispactch]);

    if (loading) {
        return <Loading />
    }

    return(
        <div className="app container-fluid">
            {space !== "settings" && space !== 'edit' && 
            <div className='brand-app'>
                <i className="fa-solid fa-cat text-white pe-1"></i>
                Zentangle
            </div>}

            <div className="row">
                <div className={`space col-12 col-md-9 ${(space === 'edit' || space === 'settings')? 'edit-active' : ''}`}>
                    {space === 'home' && <Profile />}
                    {space === 'account' && window.innerWidth <= 768 && <Account setSpace={setSpace} />}
                    {space === 'account' && window.innerWidth > 768 && <AccountBig setSpace={setSpace} />}
                    {space === 'settings' && <Settings setSpace={setSpace} />}
                    {space === 'edit' && <Edit setSpace={setSpace} />}
                </div>
                {space === 'home' &&
                <div className="sidebar col-md-3">
                    <div className='topbar'>
                        <div className='explore'>
                            <img src={exploreIcon} alt='explore'></img>
                        </div>
                        <div onClick={() => setSpace('account')} className='account'>
                            Account
                            <img src={accountIcon} alt="account" />
                        </div>
                    </div>
                    <div className='match-message'>
                        <span onClick={() => setInMessage(false)} style={{borderBottom: !inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>matches</span>
                        <span onClick={() => setInMessage(true)} style={{borderBottom: inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>messages</span>
                    </div>
                </div>
                }
                {(space === 'account' || space === 'edit') && window.innerWidth > 768 && <div className="sidebar col-md-3"><Settings setSpace={setSpace} /></div>}
                {space !== 'edit' && space !== 'settings' &&
                <div className='belowbar'>
                    <img onClick={() => setSpace('home')} src={homeIcon} alt="home" />
                    <img onClick={() => setSpace('explore')} src={exploreIcon} alt="explore" />
                    <img onClick={() => setSpace('matches')} src={startsIcon} alt="matches" />
                    <img onClick={() => setSpace('chats')} src={chatIcon} alt="chats" />
                    <img onClick={() => setSpace('account')} src={accountIcon} alt="account" />
                </div>
                }
            </div>
        </div>
    )
}