import './App.scss';
import accountIcon from '../../../assets/images/account-icon.png';
import { lazy, memo, useEffect, useState } from 'react';
import Loading from '../../../components/user/loading/Loading';
import useGeoLocation from '../../../hooks/useGeoLocation';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../../redux/actions/locationActions';
import axios from '../../../instances/axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setUsername } from '../../../redux/actions/usernameActions';
import { socket } from '../../../instances/socket';
import Swal from 'sweetalert2';

const AccountBig = lazy(() => import('../../../components/user/accountBig/AccountBig'));
const Profile = lazy(() => import('../../../components/user/profile/Profile'));
const Edit = lazy(() => import('../../../components/user/editProfile/EditProfile'));
const Settings = lazy(() => import('../../../components/user/settings/Settings'));
const Account = lazy(() => import('../../../components/user/account/Account'));
const Matches = lazy(() => import('../../../components/user/matches/Matches'));
const ViewProfile = lazy(() => import('../../../components/user/viewProfile/viewProfile'));
const Messages = lazy(() => import('../../../components/user/messages/Messages'));
const Chat = lazy(() => import('../../../components/user/chatbox/Chat'));
const VideoCall = lazy(() => import('../../../components/user/videoCall/VideoCall'));
const Preview = lazy(() => import('../../../components/user/preview/Preview'));
const Verification = lazy(() => import('../../../components/user/verification/Verification'));
const Premium = lazy(() => import('../../../components/user/premium/Premium'));
const Explore = lazy(() => import('../../../components/user/explore/Explore'));

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
                allowOutsideClick: false,
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
                    {['forlove', 'befriends', 'freetonight', 'coffeedate', 'verified'].includes(space) &&
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

                {(space === 'explore' && window.innerWidth > 768 || ['forlove', 'befriends', 'freetonight', 'coffeedate', 'verified'].includes(space)) &&
                    <div className="sidebar col-md-3"> <Explore setSpace={setSpace} /> </div>
                }

                {['home', 'explore', 'matches', 'messages', 'account'].includes(space) &&
                <div className='belowbar'>
                    <i className={`fa-solid fa-cat ${space === 'home' ? 'active':''}`} onClick={() => navigate('/app')}></i>
                    <i className={`fa-solid fa-paw ${space === 'explore' ? 'active':''}`} onClick={() => navigate('/app/explore')}></i>
                    <i className={`fa-solid fa-heart ${space === 'matches' ? 'active':''}`} onClick={() => navigate('/app/matches')}></i>
                    <i className={`fa-solid fa-message ${space === 'messages' ? 'active':''}`} onClick={() => navigate('/app/messages')}></i>
                    <i className={`fa-solid fa-user ${space === 'account' ? 'active':''}`} onClick={() => navigate('/app/account')}></i>
                </div>  
                }
            </div>
        </div>
        </>
    )
}