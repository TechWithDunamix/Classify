import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

const VideoCallComponent = () => {
  const [peer, setPeer] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const mainVideoRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const alertsRef = useRef(null);
  const onlineLearnersRef = useRef(null);

  useEffect(() => {
    const peerInstance = new Peer(); // Initialize PeerJS
    setPeer(peerInstance);

    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCurrentStream(stream);

        // Display local video stream
        const myVideo = document.createElement('video');
        myVideo.srcObject = stream;
        myVideo.muted = true;
        myVideo.play();
        mainVideoRef.current.appendChild(myVideo);

        peerInstance.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            const video = document.createElement('video');
            video.srcObject = remoteStream;
            video.play();
            const thumbnail = document.createElement('div');
            thumbnail.className = 'w-24 h-24 bg-gray-800 rounded-lg';
            thumbnail.appendChild(video);
            thumbnailsRef.current.appendChild(thumbnail);
          });
        });

        peerInstance.on('open', (id) => {
          console.log('My peer ID is: ' + id);
        });
      } catch (err) {
        console.error('Failed to get user media', err);
      }
    };

    getUserMedia();

    return () => {
      // Clean up peer instance on unmount
      if (peerInstance) peerInstance.destroy();
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const endCall = () => {
    if (peer) {
      peer.destroy();
    }
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
      mainVideoRef.current.innerHTML = ''; // Clear the main video area
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      // Stop the current stream
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        setCurrentStream(null);
      }

      // Replace the main video feed with the screen stream
      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.play();
      mainVideoRef.current.innerHTML = ''; // Clear the main video area
      mainVideoRef.current.appendChild(screenVideo);

      // Update the current stream
      setCurrentStream(screenStream);
    } catch (err) {
      console.error('Failed to share screen', err);
    }
  };

  useEffect(() => {
    // Simulate adding online learners and alerts
    onlineLearnersRef.current.innerHTML = `
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student A</li>
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student B</li>
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student C</li>
    `;
    alertsRef.current.innerHTML = `<p class="text-yellow-800">Student X has raised their hand</p>`;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Main Video Feed */}
        <div ref={mainVideoRef} className="flex-1 video-feed bg-black"></div>
        {/* Thumbnail Videos */}
        <div ref={thumbnailsRef} className="absolute bottom-4 left-4 flex gap-4"></div>
        {/* Controls Area */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          <button
            onClick={endCall}
            className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <i className="fas fa-phone-slash mr-2"></i> End Call
          </button>
          <button
            onClick={shareScreen}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <i className="fas fa-desktop mr-2"></i> Share Screen
          </button>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-72 bg-gray-100 p-4 flex flex-col border-l border-gray-300">
        {/* Alerts Section */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">Alerts</p>
          <div ref={alertsRef} className="p-2 bg-yellow-100 border border-yellow-300 rounded-lg"></div>
        </div>
        {/* Online Learners List */}
        <div>
          <p className="text-lg font-semibold mb-2">Online Learners</p>
          <ul ref={onlineLearnersRef} className="list-disc pl-5"></ul>
        </div>
      </div>
    </div>
  );
};

export default VideoCallComponent;
