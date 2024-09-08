import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { FaDesktop, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaArrowDown, FaArrowUp } from 'react-icons/fa';

const VideoCallComponent = () => {
  const [peer, setPeer] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [originalStream, setOriginalStream] = useState(null); // Store original stream
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [showPermissionModal, setShowPermissionModal] = useState(true); 
  const [showStudentList, setShowStudentList] = useState(false); // State for toggling student list
  const [isSharingScreen, setIsSharingScreen] = useState(false); // Track screen sharing state
  const mainVideoRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const alertsRef = useRef(null);
  const onlineLearnersRef = useRef(null);

  useEffect(() => {
    const peerInstance = new Peer();
    setPeer(peerInstance);

    return () => {
      if (peerInstance) peerInstance.destroy();
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCurrentStream(stream);
      setOriginalStream(stream); // Save the original stream
      setLoading(false);

      const myVideo = mainVideoRef.current;
      myVideo.srcObject = stream;
      myVideo.muted = true;
      myVideo.play();

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          const video = document.createElement('video');
          video.srcObject = remoteStream;
          video.play();
          thumbnailsRef.current.appendChild(video);
        });
      });

      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
      });
    } catch (err) {
      console.error('Failed to get user media', err);
      setLoading(false);
    }
  };

  const handleAcceptPermissions = async () => {
    setShowPermissionModal(false);
    await getUserMedia();
  };

  const endCall = () => {
    if (peer) {
      peer.destroy();
    }
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
      mainVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    if (currentStream) {
      currentStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const shareScreen = async () => {
    try {
      if (isSharingScreen) {
        // Stop screen sharing and revert to original stream
        const video = mainVideoRef.current;
        video.srcObject = originalStream;
        video.play();
        setCurrentStream(originalStream);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = mainVideoRef.current;
        video.srcObject = screenStream;
        video.play();
        setCurrentStream(screenStream);
      }
      setIsSharingScreen(!isSharingScreen); // Toggle screen sharing state
    } catch (err) {
      console.error('Failed to share screen', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Modal for Permissions */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Allow Access</h2>
            <p className="mb-4">This app needs access to your camera and microphone to continue.</p>
            <button
              onClick={handleAcceptPermissions}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {/* Main Video Area and Student List */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main Video Area */}
        <div className="flex-1  flex justify-center items-center">
          <video
            ref={mainVideoRef}
            className="w-full h-full object-cover border border-gray-300 rounded-md"
          ></video>
        </div>

        {/* Online Learners Section */}
        <div className={`md:w-1/4 p-4 bg-gray-800 text-white border-l border-gray-700 md:block ${showStudentList ? 'block' : 'hidden'}`}>
          <h3 className="text-lg font-semibold">Online Learners</h3>
          <ul ref={onlineLearnersRef} className="list-disc pl-5">
            <li>Student A</li>
            <li>Student B</li>
            <li>Student C</li>
          </ul>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-start p-4 bg-gray-900 text-white">
        {/* Thumbnail Section */}
        <div className="flex gap-4" ref={thumbnailsRef}>
          {/* Remote streams will be appended here */}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button onClick={endCall} className="bg-red-600 p-3 rounded-full">
            <FaPhoneSlash />
          </button>
          <button onClick={shareScreen} className={`p-3 rounded-full ${isSharingScreen ? 'bg-gray-500' : 'bg-blue-600'}`}>
            <FaDesktop />
          </button>
          <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-gray-500' : 'bg-green-600'}`}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
        </div>
      </div>

      {/* Toggle Student List Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center border-t border-gray-700">
        <button 
          onClick={() => setShowStudentList(!showStudentList)}
          className="flex items-center gap-2"
        >
          {showStudentList ? 'Hide Students' : 'Show Students'}
          {showStudentList ? <FaArrowUp /> : <FaArrowDown />}
        </button>
      </div>
    </div>
  );
};

export default VideoCallComponent;
