import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { FaHandPaper, FaPaperPlane } from 'react-icons/fa';

const StudentViewComponent = () => {
  const [peer, setPeer] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [message, setMessage] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);
  const videoRef = useRef(null);
  const queryParams = new URLSearchParams(window.location.search);
  const peerId = queryParams.get('peerId'); // Get peerId from query parameters

  useEffect(() => {
    if (!peerId) {
      console.error('No peer ID provided in query parameters.');
      return;
    }

    const peerInstance = new Peer();
    setPeer(peerInstance);

    peerInstance.on('open', () => {
      console.log('Connected to peer network.');

      
      if (peerId) {
        const call = peerInstance.call(peerId, null);

        if (call) {
          call.on('stream', (remoteStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
              videoRef.current.play();
            }
            setCurrentStream(remoteStream);
          });

          call.on('error', (err) => {
            console.error('Call error:', err);
          });

          call.on('close', () => {
            console.log('Call ended.');
          });
        } else {
          console.error('Failed to make a call. Call object is null.');
        }
      } else {
        console.error('Invalid peer ID.');
      }
    });

    peerInstance.on('call', (call) => {
      // Handle incoming calls (if applicable)
      call.answer(); // Answer the call with no stream initially
      call.on('stream', (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play();
        }
        setCurrentStream(remoteStream);
      });

      call.on('error', (err) => {
        console.error('Incoming call error:', err);
      });
    });

    peerInstance.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    return () => {
      if (peerInstance) peerInstance.destroy();
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, [peerId, currentStream]);

  const handleRaiseHand = () => {
    // Logic for raising hand, e.g., notify the teacher
    console.log('Raise hand button clicked');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logic for sending a message
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Video Area */}
      <div className="flex-1 flex justify-center items-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover border border-gray-300 rounded-md"
          autoPlay
        ></video>
      </div>

      {/* Controls */}
      <div className="flex flex-col p-4 bg-gray-900 text-white">
        {/* Raise Hand Button */}
        <button
          onClick={handleRaiseHand}
          className="bg-yellow-600 p-3 rounded-full mb-4"
        >
          <FaHandPaper />
        </button>

        {/* Message Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded border border-gray-300"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 p-2 rounded-full"
          >
            <FaPaperPlane />
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
        </button>
      </div>
    </div>
  );
};

export default StudentViewComponent;
