import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

const StudentVideoCallComponent = () => {
  const [peer, setPeer] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const mainVideoRef = useRef(null);
  const onlineLearnersRef = useRef(null);

  useEffect(() => {
    const peerInstance = new Peer(); // Initialize PeerJS
    setPeer(peerInstance);

    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setCurrentStream(stream);

        // Display local audio stream
        const audio = document.createElement('audio');
        audio.srcObject = stream;
        audio.muted = true; // Mute local audio
        audio.play();

        peerInstance.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            const audio = document.createElement('audio');
            audio.srcObject = remoteStream;
            audio.play();
            mainVideoRef.current.appendChild(audio);
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

  const raiseHand = () => {
    setAlerts([...alerts, 'Student has raised their hand']);
  };

  useEffect(() => {
    // Simulate adding online learners
    onlineLearnersRef.current.innerHTML = `
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student A</li>
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student B</li>
      <li class="flex items-center"><i class="fas fa-user mr-2"></i> Student C</li>
    `;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Audio Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Main Audio Feed */}
        <div ref={mainVideoRef} className="flex-1 audio-feed bg-black"></div>
        {/* Controls Area */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          <button
            onClick={raiseHand}
            className="bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <i className="fas fa-hand-paper mr-2"></i> Raise Hand
          </button>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-72 bg-gray-100 p-4 flex flex-col border-l border-gray-300">
        {/* Alerts Section */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">Alerts</p>
          <div className="p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
            {alerts.map((alert, index) => (
              <p key={index} className="text-yellow-800">{alert}</p>
            ))}
          </div>
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

export default StudentVideoCallComponent;
