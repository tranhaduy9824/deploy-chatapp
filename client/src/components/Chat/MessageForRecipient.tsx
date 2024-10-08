import Avatar from "../Avatar";
import { User } from "../../types/auth";
import MessageContent from "./MessageContent";

interface MessageForRecipientProps {
  msg: Message;
  showAvatar: boolean;
  recipientUser: User | null;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  pin: boolean;
  setPin: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyingTo: React.Dispatch<React.SetStateAction<null | Message>>;
  setEdit: React.Dispatch<React.SetStateAction<null | Message>>;
}

const MessageForRecipient = ({
  msg,
  showAvatar,
  recipientUser,
  showEmojiPicker,
  setShowEmojiPicker,
  showMore,
  setShowMore,
  pin,
  setPin,
  setReplyingTo,
  setEdit,
}: MessageForRecipientProps) => (
  <>
    <div
      className="d-flex align-items-end me-2 mt-auto"
      style={{ width: "35px", height: "100%" }}
    >
      {showAvatar && (
        <Avatar
          user={msg.senderId === recipientUser?._id ? recipientUser : null}
          width={35}
          height={35}
        />
      )}
    </div>
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
  </>
);

export default MessageForRecipient;
