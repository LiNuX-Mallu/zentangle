import { useEffect, useRef, useState } from 'react';
import styles from './VideoCall.module.css';
import { socket } from '../../../instances/socket';

interface Props {
    username: string,
    myUsername: string,
    setInVideoCall: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Data {
    offer?: RTCSessionDescription;
    answer?: RTCSessionDescription;
    candidate?: RTCIceCandidate;
}

export default function VideoCall({username, myUsername, setInVideoCall}: Props) {
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream: MediaStream) => {
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
                myVideoRef.current.play();
            }

            setStream(stream);
            
            const peerConnection = new RTCPeerConnection();

            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('sendSignal', {candidate: event.candidate, to: username});
                }
            };

            peerConnection.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    remoteVideoRef.current?.play();
                }
            }

            peerConnection?.createOffer()
            .then((offer) => peerConnection.setLocalDescription(offer))
            .then(() => {
                socket.emit('sendSignal', {offer: peerConnection.localDescription, to: username});
            });

            setPeer(peerConnection);
        });
    }, [username]);

    useEffect(() => {
        function receiveSignal(data: Data) {
            if (data.offer) {
                const remoteOffer = new RTCSessionDescription(data.offer);
                peer?.setRemoteDescription(remoteOffer)
                .then(() => peer.createAnswer())
                .then((answer) => peer.setLocalDescription(answer))
                .then(() => socket.emit('sendSignal', {answer: peer?.localDescription, to: username}));
            } else if (data.answer) {
                const remoteAnswer = new RTCSessionDescription(data?.answer);
                if (peer?.signalingState !== 'stable' && peer?.signalingState !== 'have-remote-offer') {
                    peer?.setRemoteDescription(remoteAnswer);
                }
            } else if (data.candidate) {
                const iceCandidate = new RTCIceCandidate(data?.candidate);
                if (peer?.remoteDescription) {
                    peer?.addIceCandidate(iceCandidate);
                }
            }
        }

        socket.on('receiveSignal', receiveSignal);

        return () => {
            socket.off('receiveSignal', receiveSignal);
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            if (peer) peer.close();
        }

    }, [peer, username, stream]);

    const handleEndCall = () => {
        socket.emit('sendEndCall', {from: myUsername, to: username});
        setInVideoCall(null);
    }

    return (
        <div className={styles['video-call']}>
            <div className={styles.videos}>
                <video className={styles['remote-video']} ref={remoteVideoRef} playsInline />
                <video className={styles['my-video']} ref={myVideoRef} muted playsInline />
            </div>
            <button onClick={handleEndCall} className={styles['end-call']}>End call</button>
        </div>
    )
}