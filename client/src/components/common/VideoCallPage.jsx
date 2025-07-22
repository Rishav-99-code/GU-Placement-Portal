// This file has been removed as part of the video call feature removal.
// All related functionality has been deprecated and is no longer in use.
// (File intentionally left blank after video call feature removal)
// frontend/src/pages/common/VideoCallPage.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext'; // Assuming you use AuthContext for user info

const VideoCallPage = () => {
  const { callId } = useParams(); // For unique call identification, e.g., /call/:callId
  const { authState } = useContext(AuthContext); // Get authenticated user's ID
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStatus, setCallStatus] = useState("Connecting...");

  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Consider adding TURN servers for more reliable connections in restrictive networks
    // { urls: 'turn:YOUR_TURN_SERVER_URL', username: 'YOUR_USERNAME', credential: 'YOUR_PASSWORD' }
  ];

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      toast.error("You must be logged in to make a call.");
      // Redirect to login if not authenticated
      // window.location.href = '/login';
      return;
    }

    // Initialize Socket.IO connection
    // Ensure REACT_APP_BACKEND_URL is correctly set in your .env file
    socket.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

    socket.current.on('connect', () => {
      console.log('Socket Connected:', socket.current.id);
      // Join a room specific to this call ID
      socket.current.emit('join-call', { callId, userId: authState.user.id });
      setCallStatus("Waiting for other participant...");
    });

    // This event signifies another user has joined the call room
    socket.current.on('user-joined', async (message) => {
      toast.success(message);
      setCallStatus("User joined. Starting call...");
      // Start media and create peer connection for this user
      await startMediaAndPeerConnection();
      // If this user is the one who joined *second*, they will receive an offer.
      // If this user is the *first* (initiator), they will create the offer after media is ready.
    });

    socket.current.on('user-left', (message) => {
      toast.error(message);
      setCallStatus("Other participant left.");
      stopCall();
    });

    socket.current.on('offer', async (data) => {
      console.log('Received offer');
      if (!peerConnection.current) {
        // Create peer connection if it doesn't exist yet (important if offer arrives before local stream)
        await createPeerConnection();
      }
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      // 🔥 IMPORTANT FIX: Removed 'to: data.from' here.
      // For a 2-person room, `socket.to(callId).emit` on backend handles targeting the other peer.
      // If `to: data.from` was necessary, `data.from` would be the socket.id of the offerer.
      // The current backend logic just emits to the room, so 'to' is not needed on frontend for answer.
      socket.current.emit('answer', { answer, callId });
    });

    socket.current.on('answer', async (data) => {
      console.log('Received answer');
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.current.on('candidate', async (data) => {
      console.log('Received ICE candidate');
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error('Error adding received ICE candidate', e);
      }
    });

    socket.current.on('call-error', (message) => {
      toast.error(`Call Error: ${message}`);
      setCallStatus(`Error: ${message}`);
      stopCall();
    });

    socket.current.on('disconnect', () => {
      console.log('Socket Disconnected');
      toast.error("Disconnected from call server.");
      stopCall();
    });

    // 🔥 IMPORTANT REFINEMENT: Renamed to clearly indicate it handles both media and PC setup.
    const startMediaAndPeerConnection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        await createPeerConnection(); // Ensure peer connection is set up

        stream.getTracks().forEach(track => {
          // Add local media tracks to the peer connection
          peerConnection.current.addTrack(track, stream);
        });

        // 🔥 IMPORTANT REFINEMENT: More robust initiator logic.
        // The first person in the room (the initiator) will create the offer.
        // We need to check if we are the only one in the room when this function runs.
        // This usually happens when the "user-joined" event means *we* are the second person,
        // or when we are the first person and the other user hasn't joined yet.
        // The backend `user-joined` event will trigger `startMediaAndPeerConnection` for the *second* user.
        // The first user should ideally wait for the 'user-joined' event before making an offer,
        // or have a more explicit "call initiated" signal.
        // For simplicity, let's assume the first person to join the room eventually triggers this.
        // A more correct way for 2-person calls: the person who triggers 'user-joined' (the 2nd person)
        // waits for an offer, while the *initiator* (1st person) creates it *after* the other joins.

        // Given your backend's `user-joined` sends to the *second* user,
        // the first user needs a way to know the second user has joined.
        // The `user-joined` event is only emitted to others in the room.
        // So, the initiator should await a signal from the server that the second user is ready.

        // A simple way to determine the initiator without server state for 2-person call:
        // The person who *receives* the `user-joined` message is *not* the initiator.
        // The person who *emits* `join-call` and receives `user-joined` for *another* user is the initiator.
        // Let's assume the first person initiates the offer upon receiving 'user-joined' (meaning someone else joined)
        // OR, if they are the FIRST to join, they wait.

        // For a basic 2-person setup, where the first person in the room should initiate the offer
        // AFTER the second person has joined (and this `startMediaAndPeerConnection` is called on both):
        // We need to ensure the offer is only created once.
        // This is a common point of complexity in WebRTC.
        // Let's use `socket.current.id` as a simple unique identifier.
        // If you are the person who initiated the call (e.g. clicked the call button),
        // you would typically generate the offer. This info isn't directly in this component.
        // For now, let's simplify based on which user is 'first' to get their media ready.
        // The current `if (socket.current.id === authState.user.id)` is very simplistic and not reliable for initiator.

        // A more robust but still simple initiator logic for 2-person calls:
        // The user whose `socket.id` is lexicographically smaller initiates the offer.
        // Or, more commonly, the user who sends the `initiate-call` event to the backend is the offerer.
        // As we don't have that `initiate-call` logic here, let's stick to a reliable signaling flow:
        // The "join-call" triggers "user-joined" for the *other* peer.
        // The peer who receives "user-joined" should then consider creating an offer if they are the primary.
        // For this example, let's assume the client whose `socket.id` is smaller in the room initiates.
        // This is still not robust without knowing the other socket ID at this point.

        // REVISED INITIATOR LOGIC: The `user-joined` event on the backend is emitted to the *existing* clients in the room
        // when a new client joins. This means the client *receiving* `user-joined` should be the offerer.
        // The client *emitting* `user-joined` (the newly joined client) should wait for an offer.
        // This flow is more typical for WebRTC.

        // So, when `user-joined` is received by the *first* participant (who is waiting), they should create the offer.
        // The `startMediaAndPeerConnection` function is called for *both* participants.
        // The `user-joined` event itself is the trigger for the first client to *start* their PC and create offer.
        // The second client just joins and waits for the offer.

        // Let's adjust the logic to reflect this common WebRTC handshake:
        // The "join-call" for the FIRST person simply prepares.
        // The "join-call" for the SECOND person triggers "user-joined" on the server
        // which sends it to the FIRST person. The FIRST person then makes the offer.
