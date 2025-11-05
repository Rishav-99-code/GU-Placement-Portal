import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Button } from '../ui/button';

const VideoCall = ({ interviewId, userRole, onEndCall }) => {
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    newSocket.on('callUser', ({ from, signal }) => {
      const newPeer = new Peer({ initiator: false, trickle: false, stream });
      
      newPeer.on('signal', (data) => {
        newSocket.emit('answerCall', { signal: data, to: from });
      });

      newPeer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      newPeer.signal(signal);
      setPeer(newPeer);
      setCallAccepted(true);
    });

    newSocket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    newSocket.emit('joinRoom', interviewId);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      newSocket.disconnect();
    };
  }, []);

  const callUser = () => {
    const newPeer = new Peer({ initiator: true, trickle: false, stream });
    
    newPeer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: interviewId, signalData: data, from: socket.id });
    });

    newPeer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      newPeer.signal(signal);
    });

    setPeer(newPeer);
  };

  const leaveCall = () => {
    setCallEnded(true);
    peer.destroy();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onEndCall();
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={myVideo}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>
        
        {callAccepted && !callEnded && (
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={userVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {userRole === 'student' ? 'Recruiter' : 'Student'}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4 p-4 bg-gray-900">
        {!callAccepted && userRole === 'recruiter' && (
          <Button onClick={callUser} className="bg-green-600 hover:bg-green-700">
            Start Interview
          </Button>
        )}
        
        <Button
          onClick={toggleAudio}
          className={`${isAudioMuted ? 'bg-red-600' : 'bg-gray-600'} hover:bg-opacity-80`}
        >
          {isAudioMuted ? '🔇' : '🎤'}
        </Button>
        
        <Button
          onClick={toggleVideo}
          className={`${isVideoOff ? 'bg-red-600' : 'bg-gray-600'} hover:bg-opacity-80`}
        >
          {isVideoOff ? '📹' : '📷'}
        </Button>
        
        <Button onClick={leaveCall} className="bg-red-600 hover:bg-red-700">
          End Call
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;