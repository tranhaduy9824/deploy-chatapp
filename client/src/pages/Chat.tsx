import { useContext, useEffect, useState } from "react";
import BoxChat from "../components/Chat/BoxChat";
import InfoChat from "../components/Chat/InfoChat";
import { ChatContext } from "../context/ChatContext";
import VideoCall from "../components/Modal/VideoCall";
import { AuthContext } from "../context/AuthContext";
import { useFetchRecipientUser } from "../hooks/useFetchRecipientUser";

function Chat() {
  const [showInfoChat, setShowInfoChat] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [canNotStart, setCanNotStart] = useState<boolean>(false);

  const { user } = useContext(AuthContext)!;
  const { currentChat, socket } = useContext(ChatContext)!;

  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  useEffect(() => {
    const handleIncomingCall = () => {
      setIsCalling(true);
      setCanNotStart(true);
    };

    socket.on("incomingCall", handleIncomingCall);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
    };
  }, [currentChat, socket]);

  useEffect(() => {
    setTimeout(() => {
      const root = document.getElementById("root");
      if (root) {
        root.style.removeProperty("background-image");
      }
    }, 1000);
  }, []);

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ height: "calc(100% - 3.25rem - 8px" }}
    >
      <BoxChat
        showInfoChat={showInfoChat}
        setShowInfoChat={setShowInfoChat}
        setIsCalling={setIsCalling}
        recipientUser={recipientUser}
      />
      {showInfoChat && <InfoChat />}
      {isCalling && (
        <VideoCall
          socket={socket}
          currentChat={currentChat}
          user={user}
          isCalling={isCalling}
          setIsCalling={setIsCalling}
          canNotStart={canNotStart}
          setCanNotStart={setCanNotStart}
          recipientUser={recipientUser}
        />
      )}
    </div>
  );
}

export default Chat;
