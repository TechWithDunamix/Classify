import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';

const VideoCall = () => {
    const [peerId, setPeerId] = useState('');
    const [connectedPeerId, setConnectedPeerId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState('');
    const [peerStreams, setPeerStreams] = useState([]);
    const myVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        // Initialize PeerJS
        const peer = new Peer();
        peer.on('open', (id) => {
            setPeerId(id);
        });

        peer.on('call', (call) => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    myVideoRef.current.srcObject = stream;
                    call.answer(stream); // Answer the call with our stream
                    call.on('stream', (peerStream) => {
                        setPeerStreams(prevStreams => [...prevStreams, peerStream]);
                    });
                }).catch((error) => {
                    console.error('Error accessing media devices.', error);
                    setError('Error accessing media devices.');
                });
            } else {
                console.error('Media Devices not supported');
                setError('Media Devices not supported.');
            }
        });

        peerInstance.current = peer;
    }, []);

    const callPeer = (id) => {
        setIsCalling(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                myVideoRef.current.srcObject = stream;
                const call = peerInstance.current.call(id, stream);
                call.on('stream', (peerStream) => {
                    setPeerStreams(prevStreams => [...prevStreams, peerStream]);
                });
                setIsCalling(false);
            }).catch((error) => {
                console.error('Error accessing media devices.', error);
                setError('Error accessing media devices.');
                setIsCalling(false);
            });
        } else {
            console.error('Media Devices not supported');
            setError('Media Devices not supported.');
            setIsCalling(false);
        }
    };

    const joinRoom = (id) => {
        setIsCalling(true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                myVideoRef.current.srcObject = stream;
                // Assuming you want to call a peer in a specific room or group
                const call = peerInstance.current.call(id, stream);
                call.on('stream', (peerStream) => {
                    setPeerStreams(prevStreams => [...prevStreams, peerStream]);
                });
                setIsCalling(false);
            }).catch((error) => {
                console.error('Error accessing media devices.', error);
                setError('Error accessing media devices.');
                setIsCalling(false);
            });
        } else {
            console.error('Media Devices not supported');
            setError('Media Devices not supported.');
            setIsCalling(false);
        }
    };

    const createRoom = () => {
        // Implementation of room creation logic
        // For example, you might generate a room ID and set isHost to true
        const generatedRoomId = Math.random().toString(36).substr(2, 9);
        setRoomId(generatedRoomId);
        setIsHost(true);
    };

    const handleScreenShare = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
            const videoTrack = stream.getVideoTracks()[0];
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = new MediaStream([videoTrack]);
            }
        }).catch(error => {
            console.error('Error sharing screen.', error);
            setError('Error sharing screen.');
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-4">Video Call</h1>
                <p className="text-lg">Your Peer ID: <span className="font-mono text-blue-600">{peerId}</span></p>
                {isHost && roomId && (
                    <p className="text-lg mt-4">Room ID: <span className="font-mono text-green-600">{roomId}</span></p>
                )}
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="relative flex gap-4 mb-6 flex-wrap">
                <video ref={myVideoRef} autoPlay playsInline className="w-1/4 bg-black rounded-lg shadow-lg"></video>
                {peerStreams.slice(0, 10).map((stream, index) => (
                    <video
                        key={index}
                        autoPlay
                        playsInline
                        className="w-1/4 h-1/4 bg-black rounded-full border-2 border-gray-400"
                        srcObject={stream}
                    ></video>
                ))}
                {peerStreams.length > 10 && (
                    <button className="btn btn-primary absolute bottom-4 right-4">
                        More
                    </button>
                )}
            </div>
            <div className="mt-6">
                {isHost ? (
                    <button
                        onClick={createRoom}
                        className="btn btn-primary"
                    >
                        Create Room
                    </button>
                ) : (
                    <>
                        <input
                            type="text"
                            value={connectedPeerId}
                            onChange={(e) => setConnectedPeerId(e.target.value)}
                            placeholder="Enter Room ID to join"
                            className="input input-bordered w-full max-w-xs"
                        />
                        <button
                            onClick={() => joinRoom(connectedPeerId)}
                            className={`btn ${isCalling ? 'btn-disabled' : 'btn-primary'} ml-4`}
                            disabled={isCalling}
                        >
                            {isCalling ? 'Joining...' : 'Join'}
                        </button>
                    </>
                )}
                <button
                    onClick={handleScreenShare}
                    className="btn btn-secondary mt-4"
                >
                    Share Screen
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
