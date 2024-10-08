import { User } from "../../types/auth";
import Avatar from "../Avatar";
import MessageContent from "./MessageContent";

interface MessageForSenderProps {
  msg: Message;
  showAvatar: boolean;
  user: User | null;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  pin: boolean;
  setPin: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyingTo: React.Dispatch<React.SetStateAction<null | Message>>;
  setEdit: React.Dispatch<React.SetStateAction<null | Message>>;
}

const MessageForSender = ({
  msg,
  showAvatar,
  user,
  showEmojiPicker,
  setShowEmojiPicker,
  showMore,
  setShowMore,
  pin,
  setPin,
  setReplyingTo,
  setEdit,
}: MessageForSenderProps) => (
  <>
    <MessageContent
      msg={msg}
      showEmojiPicker={showEmojiPicker}
      setShowEmojiPicker={setShowEmojiPicker}
      showMore={showMore}
      setShowMore={setShowMore}
      pin={pin}
      setPin={setPin}
      setReplyingTo={setReplyingTo}
      setEdit={setEdit}
    />
    <div
      className="d-flex align-items-end ms-2 mt-auto"
      style={{ width: "35px", height: "100%" }}
    >
      {showAvatar && (
        <Avatar
          user={msg.senderId === user?._id ? user : null}
          width={35}
          height={35}
        />
      )}
    </div>
  </>
);

export default MessageForSender;
