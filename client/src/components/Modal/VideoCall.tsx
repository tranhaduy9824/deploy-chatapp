/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import WrapperModal from "../WrapperModal";
import Avatar from "../Avatar";
import { Socket } from "socket.io-client";
import { User } from "../../types/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faTimes,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import callSound from "../../assets/sound_call.mp3";

interface VideoCallProps {
  socket: Socket;
  currentChat: Chat | null;
  user: User | null;
  isCalling: boolean;
  setIsCalling: React.Dispatch<React.SetStateAction<boolean>>;
  canNotStart?: boolean;
  setCanNotStart: React.Dispatch<React.SetStateAction<boolean>>;
  recipientUser: User | null;
}

const VideoCall: React.FC<VideoCallProps> = ({
  socket,
  currentChat,
  user,
  isCalling,
  setIsCalling,
  canNotStart = false,
  setCanNotStart,
  recipientUser,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState<
    RTCIceCandidate[]
  >([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [isIncomingCall, setIsIncomingCall] = useState<boolean>(false);
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(false);
  const [callerInfo, setCallerInfo] = useState<{
    callerId: string;
    callerName: string;
    callerAvatar: string;
  } | null>(null);
  const [savedChatId, setSavedChatId] = useState<string | null>(null);
  const [savedMembers, setSavedMembers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(isCalling);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [recipientOnAnotherCall, setRecipientOnAnotherCall] = useState(false);
  let callAudio: HTMLAudioElement | null = null;

  const startCall = async () => {
    if (!isMounted) return;

    try {
      setIsRejected(false);

      console.log("Starting call...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      } else {
        console.warn("Local video ref is not available");
      }

      if (!peerConnectionRef.current) {
        const peerConnection = new RTCPeerConnection();
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("iceCandidate", {
              candidate: event.candidate,
              chatId: savedChatId || currentChat?._id,
              members: Array.isArray(currentChat?.members)
                ? currentChat.members
                : [],
            });
          }
        };

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnectionRef.current = peerConnection;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("startCall", {
          chatId: currentChat?._id,
          userId: user?._id,
          userName: user?.fullname,
          userAvatar: user?.avatar,
          members: Array.isArray(currentChat?.members)
            ? currentChat.members
            : [],
          offer,
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleIncomingCall = async ({
    callerId,
    callerName,
    callerAvatar,
    offer,
    members,
    chatId,
    canNotAccept,
  }: {
    callerId: string;
    callerName: string;
    callerAvatar: string;
    offer: RTCSessionDescriptionInit;
    members: string[];
    chatId: string;
    canNotAccept: boolean;
  }) => {
    console.log("Incoming call...");

    if (!isMounted) return;

    try {
      setIsRejected(false);
      if (!canNotAccept) {
        setIsIncomingCall(true);
      } else {
        setIsIncomingCall(false);
      }
      setCallerInfo({ callerId, callerName, callerAvatar });
      setSavedChatId(chatId);
      setSavedMembers(members);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection();
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            candidate: event.candidate,
            chatId,
            members,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = peerConnection;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answerCall", {
        chatId,
        userId: user?._id,
        members,
        answer,
      });

      for (const candidate of iceCandidatesQueue) {
        await peerConnection.addIceCandidate(candidate);
      }
      setIceCandidatesQueue([]);
    } catch (error) {
      console.error("Error handling incoming call:", error);
    }
  };

  const onIceCandidateReceived = (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(candidate);
    } else {
      iceCandidatesQueue.push(candidate);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.remoteDescription
      ) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } else {
        setIceCandidatesQueue((prevQueue) => [...prevQueue, candidate]);
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  };

  const endCall = (createMessage: boolean = true) => {
    try {
      console.log("Ending call...");
      socket.emit("endCall", {
        chatId: savedChatId || currentChat?._id,
        userId: user?._id,
        members:
          Array.isArray(savedMembers) && savedMembers.length > 0
            ? savedMembers
            : currentChat?.members,
        createMessage,
      });

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      setIsCalling((prev) => {
        console.log("Previous isCalling:", prev);
        return false;
      });
      setCanNotStart(false);
      setIsIncomingCall(false);
      setIsCallAccepted(false);
      setCallerInfo(null);
      console.log("Call ended successfully");
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleCallAnswered = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    try {
      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.signalingState === "stable") {
          console.warn("PeerConnection is already in stable state.");
          return;
        }
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setIsCallAccepted(true);

        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        for (const candidate of iceCandidatesQueue) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
        setIceCandidatesQueue([]);
      }
    } catch (error) {
      console.error("Error handling call answered:", error);
    }
  };

  const handleCallEnded = () => {
    try {
      console.log("Call ended by remote");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      if (!isRejected) {
        setIsCalling(false);
      }
      setCanNotStart(false);
      setIsIncomingCall(false);
      setIsCallAccepted(false);
      setCallerInfo(null);
    } catch (error) {
      console.error("Error handling call ended:", error);
    }
  };

  const handleCallRejected = () => {
    try {
      setIsRejected(true);
      setIsIncomingCall(false);
    } catch (error) {
      console.error("Error handling call rejected:", error);
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
      console.log("Microphone toggled:", !isMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOff(!isCameraOff);
      console.log("Camera toggled:", !isCameraOff);
    }
  };

  const acceptCall = async () => {
    console.log("Call accepted");
    setIsIncomingCall(false);
    setIsCallAccepted(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peerConnection = new RTCPeerConnection();
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          chatId: savedChatId || currentChat?._id,
          members:
            Array.isArray(savedMembers) && savedMembers.length > 0
              ? savedMembers
              : currentChat?.members,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("startCall", {
      chatId: savedChatId || currentChat?._id,
      userId: user?._id,
      members:
        Array.isArray(savedMembers) && savedMembers.length > 0
          ? savedMembers
          : currentChat?.members,
      offer,
      canNotAccept: true,
    });

    socket.on("remoteDescription", async (remoteDescription) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answerCall", {
        chatId: savedChatId || currentChat?._id,
        userId: user?._id,
        members:
          Array.isArray(savedMembers) && savedMembers.length > 0
            ? savedMembers
            : currentChat?.members,
        answer,
      });
    });

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answerCall", {
      chatId: savedChatId || currentChat?._id,
      userId: user?._id,
      members:
        Array.isArray(savedMembers) && savedMembers.length > 0
          ? savedMembers
          : currentChat?.members,
      answer,
    });
  };

  const rejectCall = (showNotificateReject: boolean = true) => {
    console.log("Call rejected");
    const chatId = savedChatId || currentChat?._id;
    const members =
      Array.isArray(savedMembers) && savedMembers.length > 0
        ? savedMembers
        : currentChat?.members ?? [];

    if (chatId && members.length > 0) {
      socket.emit("rejectCall", {
        chatId,
        userId: user?._id,
        members,
        showNotificateReject
      });
    }

    setIsIncomingCall(false);
    endCall(false);
  };

  const handleCallAgain = () => {
    setIsRejected(false);
    setIsCalling(true);
    setIsIncomingCall(false);
    if (currentChat) {
      setIsCalling(true);
      socket.emit("startCall", {
        chatId: currentChat?._id,
        userId: user?._id,
        userName: user?.fullname,
        userAvatar: user?.avatar,
        members: Array.isArray(currentChat?.members) ? currentChat.members : [],
        offer: undefined,
      });
    }
  };

  const playCallSound = () => {
    const audio = new Audio(callSound);
    audio.loop = true;
    audio.autoplay = true;
    audio.play();
    return audio;
  };

  const stopCallSound = (audio: HTMLAudioElement) => {
    audio.pause();
    audio.currentTime = 0;
  };

  useEffect(() => {
    setIsMounted(true);
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isCalling && savedMembers) {
        endCall();
        setIsRejected(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCalling, savedMembers]);

  useEffect(() => {
    if (!isMounted) return;

    if (isCalling && !canNotStart && !isRejected) {
      startCall();
    }

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAnswered", handleCallAnswered);
    socket.on("callEnded", handleCallEnded);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callRejected", handleCallRejected);
    socket.on("activeCalls", (activeCalls) => {
      console.log(activeCalls);
      setRecipientOnAnotherCall(true);
    });

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAnswered", handleCallAnswered);
      socket.off("callEnded", handleCallEnded);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callRejected", handleCallRejected);
      socket.off("activeCalls", (activeCalls) => {
        console.log(activeCalls);
        setRecipientOnAnotherCall(false);
      });
    };
  }, [isCalling, socket, currentChat, isMounted, isRejected]);

  useEffect(() => {
    socket.on("iceCandidate", (candidate) => {
      onIceCandidateReceived(candidate);
    });

    return () => {
      socket.off("iceCandidate", onIceCandidateReceived);
    };
  }, [socket]);

  useEffect(() => {
    if (isRejected && isIncomingCall) {
      endCall(false);
    }
  }, [isRejected, isIncomingCall]);

  useEffect(() => {
    if (isIncomingCall) {
      if (Notification.permission === "granted") {
        const notification = new Notification("Incoming call", {
          body: "You have an incoming call",
        });

        notification.onclick = () => {
          window.focus();
        };

        callAudio = playCallSound();
      }
    }

    return () => {
      if (callAudio) {
        stopCallSound(callAudio);
      }
    };
  }, [isIncomingCall]);

  useEffect(() => {
    if (isIncomingCall) {
      const timer = setTimeout(() => {
        if (!isCallAccepted) {
          rejectCall();
        }
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [isIncomingCall, isCallAccepted]);

  return (
    <WrapperModal
      show={
        (isCalling || isIncomingCall || isRejected || recipientOnAnotherCall) &&
        isMounted
      }
      onClose={endCall}
      closeBtn={false}
      outsideClick={false}
    >
      <div className="video-call-container">
        {!recipientOnAnotherCall ? (
          !isRejected ? (
            isIncomingCall ? (
              <div className="incoming-call text-center">
                <Avatar
                  user={{
                    _id: callerInfo?.callerId || "",
                    email: "",
                    token: "",
                    avatar: callerInfo?.callerAvatar || "",
                    fullname: callerInfo?.callerName || "",
                  }}
                  width={80}
                  height={80}
                />
                <h3 className="my-2">{callerInfo?.callerName} gọi đến...</h3>
                <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                  <button onClick={() => rejectCall()} className="control-btn">
                    <FontAwesomeIcon icon={faTimes as IconProp} />
                  </button>
                  <button
                    onClick={acceptCall}
                    className="control-btn bg-success"
                  >
                    <FontAwesomeIcon icon={faPhone as IconProp} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className={`local-video ${!canNotStart ? "fullscreen" : ""}`}
                />
                {isCallAccepted && canNotStart && (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="remote-video"
                  />
                )}
                {!canNotStart && (
                  <h3
                    className="position-absolute z-3"
                    style={{ bottom: "70px" }}
                  >
                    Đang gọi đến {recipientUser?.fullname}...
                  </h3>
                )}
                <div className="controls">
                  <button onClick={toggleMute} className="control-btn">
                    {isMuted ? (
                      <FontAwesomeIcon icon={faMicrophoneSlash as IconProp} />
                    ) : (
                      <FontAwesomeIcon icon={faMicrophone as IconProp} />
                    )}
                  </button>
                  <button onClick={toggleCamera} className="control-btn">
                    {isCameraOff ? (
                      <FontAwesomeIcon icon={faVideoSlash as IconProp} />
                    ) : (
                      <FontAwesomeIcon icon={faVideo as IconProp} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      !(isCallAccepted && canNotStart)
                        ? rejectCall(false)
                        : endCall()
                    }
                    className="control-btn bg-danger cancel-call"
                  >
                    <FontAwesomeIcon icon={faPhone as IconProp} />
                  </button>
                </div>
              </>
            )
          ) : (
            <div className="incoming-call text-center">
              <Avatar user={recipientUser} width={80} height={80} />
              <h3 className="my-2">{recipientUser?.fullname} đã từ chối...</h3>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                <button
                  onClick={handleCallAgain}
                  className="control-btn bg-success"
                >
                  <FontAwesomeIcon icon={faPhone as IconProp} />
                </button>
                <button
                  onClick={() => {
                    setIsRejected(false);
                    setIsCalling(false);
                  }}
                  className="control-btn"
                >
                  <FontAwesomeIcon icon={faTimes as IconProp} />
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="incoming-call text-center">
            <Avatar user={recipientUser} width={80} height={80} />
            <h3 className="my-2">
              {recipientUser?.fullname} đang có cuộc gọi khác...
            </h3>
            <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
              <button
                onClick={() => {
                  setIsRejected(false);
                  setIsCalling(false);
                }}
                className="control-btn"
              >
                <FontAwesomeIcon icon={faTimes as IconProp} />
              </button>
            </div>
          </div>
        )}
      </div>
    </WrapperModal>
  );
};

export default VideoCall;
