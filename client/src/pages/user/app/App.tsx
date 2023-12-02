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
import axios from '../../../instances/axios';
import Matches from '../../../components/user/matches/Matches';
import ViewProfile from '../../../components/user/viewProfile/viewProfile';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Messages from '../../../components/user/messages/Messages';
import Chat from '../../../components/user/chatbox/Chat';

interface Props {
    defaultSpace: string | null;
    defaultMessage?: boolean;
}

export default function App({defaultSpace, defaultMessage = false}: Props) {
    const [inMessage, setInMessage] = useState(defaultMessage);
    const [space, setSpace] = useState(defaultSpace || 'home');
    const [loading, setLoading] = useState(true);
    const {latitude, longitude, error} = useGeoLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {username} = useParams();

    useEffect(() => {
        setSpace(defaultSpace || 'home');
        setInMessage(defaultMessage);
    }, [defaultSpace, defaultMessage]);

    useEffect(() => {
        if (latitude !== null && longitude !== null && !error) {
            dispatch(setLocation({latitude, longitude}));
            axios.put('user/update-settings',{where: 'location', what: [longitude, latitude]}, {
                headers: {
                    'Content-Type': "application/json",
                }
            }).catch(() => alert("Internal server error"));
        }
        const timeout = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timeout);
    }, [latitude, longitude, error, dispatch]);

    if (loading) {
        return <Loading />
    }

    return(
        <div key={username} className="app container-fluid">
            {(space === 'home' || space === 'account') &&
            <div className='brand-app'>
                <i className="fa-solid fa-cat text-white pe-1"></i>
                Zentangle
            </div>}

            <div className="row">
                <div className={`space col-12 col-md-9 ${['edit-profile', 'settings', 'chat', 'view-profile'].includes(space) ? 'edit-active' : ''}`}>
                    {space === 'home' && <Profile />}
                    {space === 'account' && window.innerWidth <= 768 && <Account />}
                    {space === 'account' && window.innerWidth > 768 && <AccountBig />}
                    {space === 'settings' && <Settings />}
                    {space === 'edit-profile' && <Edit />}
                    {space === 'view-profile' && <ViewProfile defaultProfile={null} />}
                    {space === 'matches' && window.innerWidth <= 768 && <Matches />}
                    {space === 'messages' && window.innerWidth <= 768 && <Messages /> }
                    {space === 'chat' && <Chat /> }
                </div>
                {['home', 'view-profile', 'chat'].includes(space) &&
                <div className="sidebar col-md-3">
                    <div className='topbar'>
                        <div className='explore'>
                            <img src={exploreIcon} alt='explore'></img>
                        </div>
                        <div onClick={() => navigate('/app/account')} className='account'>
                            Account
                            <img src={accountIcon} alt="account" />
                        </div>
                    </div>
                    <div className='match-message'>
                        <span onClick={() => setInMessage(false)} style={{borderBottom: !inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>matches</span>
                        <span onClick={() => setInMessage(true)} style={{borderBottom: inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>messages</span>
                    </div>
                    {inMessage ? <Messages /> : <Matches />}
                </div>
                }
                {(space === 'account' || space === 'edit-profile') && window.innerWidth > 768 && <div className="sidebar col-md-3"><Settings /></div>}
                {['home', 'explore', 'matches', 'messages', 'account'].includes(space) &&
                <div className='belowbar'>
                    <img onClick={() => navigate('/app')} src={homeIcon} alt="home" />
                    <img onClick={() => navigate('/app/explore')} src={exploreIcon} alt="explore" />
                    <img onClick={() => navigate('/app/matches')} src={startsIcon} alt="matches" />
                    <img onClick={() => navigate('/app/messages')} src={chatIcon} alt="chats" />
                    <img onClick={() => navigate('/app/account')} src={accountIcon} alt="account" />
                </div>
                }
            </div>
        </div>
    )
}