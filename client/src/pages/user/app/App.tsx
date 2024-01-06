import './App.scss';
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
import { memo, useEffect, useState } from 'react';
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
import { setUsername } from '../../../redux/actions/usernameActions';
import { socket } from '../../../instances/socket';
import Swal from 'sweetalert2';
import VideoCall from '../../../components/user/videoCall/VideoCall';
import Preview from '../../../components/user/preview/Preview';
import Verification from '../../../components/user/verification/Verification';
import Premium from '../../../components/user/premium/Premium';
import Explore from '../../../components/user/explore/Explore';

interface Props {
    defaultSpace: string | null;
    defaultMessage?: boolean;
}

const MemoizedMatches = memo(Matches);
const MemoizedMessages = memo(Messages);

const keyForMatches = Date.now().toString();
const keyForMessages = Date.now().toString()+'msg';

export default function App({defaultSpace, defaultMessage = false}: Props) {
    const [inMessage, setInMessage] = useState(defaultMessage);
    const [space, setSpace] = useState(defaultSpace || 'home');
    const [loading, setLoading] = useState(true);
    const {latitude, longitude, error} = useGeoLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {username} = useParams();
    const [myUsername, setMyUsername] = useState<string | undefined>();
    const [myPic, setMyPic] = useState<string | null>(null);
    const socketConnected = socket.connected;
    const [incommingCall, setIncommingCall] = useState<string | null>(null);
    const [inVideoCall, setInVideoCall] = useState<string | null>(null);
    const [matchKey, setMatchKey] = useState(keyForMatches);
    const [messageKey, setMessageKey] = useState(keyForMessages);
    const [alert, setAlert] = useState(null);
    const [showPremium, setShowPremium] = useState(false);

    useEffect(() => {
        if (alert !== null || loading) return;
        axios.get('/user/alerts')
        .then((response) => {
            if (response.status === 200) {
                setAlert(response.data);
                Swal.fire({
                    title: response.data.title,
                    text: response.data.content,
                    backdrop: true,
                    background: 'black',
                    color: 'white',
                    confirmButtonColor: 'purple',
                }).then(() => setAlert(null))
            }
        });
    }, [loading, alert, space]);

    useEffect(() => {
        setSpace(defaultSpace || 'home');
        setInMessage(defaultMessage);
    }, [defaultSpace, defaultMessage]);

    useEffect(() => {
        axios.get('/user/get-details').then((response) => {
            if (response.status === 200 && response?.data?.username) {
                dispatch(setUsername(response?.data?.username));
                setMyUsername(response?.data?.username);
                setMyPic(response?.data?.profile?.medias[0] ?? null);
            }
        });
        if (latitude !== null && longitude !== null && !error) {
            dispatch(setLocation({latitude, longitude}));
            axios.put('user/update-settings',{where: 'location', what: [longitude, latitude]}, {
                headers: {
                    'Content-Type': "application/json",
                }
            })
        }
        const timeout = setTimeout(() => setLoading(false), 2000);
        return () => {
            clearTimeout(timeout);
        };
    }, [latitude, longitude, error, dispatch, space]);

    useEffect(() => {
        if (!socketConnected || !myUsername) return;

        function onReceiveVideoCallRequest(from: string) {
            setIncommingCall(from);
        }
        function stopCall(from: string) {
            if (from === incommingCall) {
                setIncommingCall(null);
            }
        }
        function endCall(from: string) {
            if (from === inVideoCall) {
                setInVideoCall(null);
                Swal.fire({
                    text: 'Call Ended',
                    backdrop: true,
                    background: 'black',
                    iconHtml: `<i class="fa-solid fa-phone"></i>`,
                    showConfirmButton: true,
                    allowOutsideClick: true,
                });
            }
        }

        socket.emit('joinApp', myUsername);
        socket.on('receiveVideoCallRequest', onReceiveVideoCallRequest);

        if (incommingCall) {
            socket.on('receiveStopCall', stopCall);
        } else socket.off('receiveStopCall', stopCall);

        if (inVideoCall) {
            socket.on('receiveEndCall', endCall);
        } else socket.off('receiveEndCall', endCall);

        return () => {
            socket.off('receiveVideoCallRequest', onReceiveVideoCallRequest);
            socket.off('receiveStopCall', stopCall);
            socket.emit('leaveApp', myUsername);
        }
    }, [myUsername, socketConnected, incommingCall, inVideoCall]);

    useEffect(() => {
        if (incommingCall !== null) {
             Swal.fire({
                title: `${incommingCall}`,
                text: 'Incomming video call',
                backdrop: true,
                background: 'black',
                iconHtml: `<i class="fa-solid fa-phone fa-beat-fade"></i>`,
                iconColor: 'yellowgreen',
                showCancelButton: true,
                confirmButtonText: 'Accept',
                cancelButtonText: 'Reject',
                cancelButtonColor: 'orangered',
                confirmButtonColor: 'green',
            }).then(res => {
                if (!res.isConfirmed) {
                    socket.emit('rejectVideoCall', {from: myUsername, to: incommingCall});
                    setIncommingCall(null);
                } else {
                    socket.emit('acceptVideoCall', {from: myUsername, to: incommingCall});
                    setInVideoCall(incommingCall);
                    setIncommingCall(null);
                }
            });
        } else {
            Swal.close();
        }
    }, [incommingCall, myUsername, username]);

    if (loading || !myUsername) {
        return <Loading />
    }

    return(
        <>
        {inVideoCall !== null && <VideoCall myUsername={myUsername} username={inVideoCall} setInVideoCall={setInVideoCall} /> }
        {showPremium && <Premium isVisible={showPremium} close={setShowPremium} /> }
        <div onClick={() => showPremium ? setShowPremium(false) : false} key={username} className={`app container-fluid ${showPremium ? 'premium' : ''}`}>
            {(space === 'home' || space === 'account') &&
            <div className='brand-app'>
                <i className="fa-solid fa-cat text-white pe-1"></i>
                Zentangle
            </div>}

            <div className="row">
                <div className={`space col-12 col-md-9 ${!['explore', 'home', 'matches', 'messages', 'account'].includes(space) ? 'others' : ''}`}>
                    {(space === 'home' || (space === 'explore' && window.innerWidth > 768)) && <Profile setSpace={setSpace} allowed={myPic !== null} setPremium={setShowPremium} setMatchKey={setMatchKey} />}
                    {space === 'account' && window.innerWidth <= 768 && <Account setSpace={setSpace} />}
                    {space === 'preview' && window.innerWidth <= 768 && <Preview setSpace={setSpace} /> }
                    {space === 'account' && window.innerWidth > 768 && <AccountBig setSpace={setSpace} />}
                    {space === 'settings' && <Settings setPremium={setShowPremium} />}
                    {space === 'edit-profile' && <Edit />}
                    {space === 'view-profile' && <ViewProfile setPremium={setShowPremium} defaultProfile={null} />}
                    {space === 'view-blocked-profile' && <ViewProfile setPremium={setShowPremium} defaultProfile={null} blocked={true} />}
                    {space === 'matches' && window.innerWidth <= 768 && <Matches />}
                    {space === 'messages' && window.innerWidth <= 768 && <Messages /> }
                    {space === 'chat' && <Chat setMessageKey={setMessageKey} /> }
                    {space === 'verification' && <Verification setSpace={setSpace} /> }
                    {space === 'explore' && window.innerWidth <= 768 && <Explore setSpace={setSpace} /> }

                    {/* explore spaces */}
                    {['forlove', 'befriends', 'freetonight', 'coffeedate'].includes(space) &&
                        <Profile setSpace={setSpace} explore={space} allowed={myPic !== null} setPremium={setShowPremium} setMatchKey={setMatchKey} />
                    }
                </div>
                {['home', 'view-profile', 'chat'].includes(space) &&
                <div className="sidebar col-md-3">
                    <div className='topbar'>
                        <div className='explore'>
                            <i onClick={() => navigate('/app/explore')} className="fa-brands fa-microsoft"></i>
                        </div>
                        <div onClick={() => navigate('/app/account')} className='account'>
                            {myUsername ?? 'Account'}
                            <div className='account-img-container'>
                                <img src={myPic ? myPic : accountIcon} alt="account" />
                            </div>
                        </div>
                    </div>
                    <div className='match-message'>
                        <span onClick={() => setInMessage(false)} style={{borderBottom: !inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>matches</span>
                        <span onClick={() => setInMessage(true)} style={{borderBottom: inMessage ? '3px solid white' : '', paddingBottom: '5px'}}>messages</span>
                    </div>
                    {inMessage ? <MemoizedMessages key={messageKey} /> : <MemoizedMatches key={matchKey} />}
                </div>
                }

                {(space === 'account' || space === 'edit-profile' || space === 'verification') && window.innerWidth > 768 && 
                    <div className="sidebar col-md-3"><Settings setPremium={setShowPremium} /></div>
                }

                {(space === 'explore' && window.innerWidth > 768 || ['forlove', 'befriends', 'freetonight', 'coffeedate'].includes(space)) &&
                    <div className="sidebar col-md-3"> <Explore setSpace={setSpace} /> </div>
                }

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
        </>
    )
}