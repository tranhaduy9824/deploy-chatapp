import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../types/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface LabelMessageProps {
  msg: Message;
  pin: boolean;
  recipientUser: User | null;
}

const LabelMessage = ({ msg, pin, recipientUser }: LabelMessageProps) => {
  const { user } = useContext(AuthContext)!;

  return (
    <>
      <span
        className={`d-block w-100 small ${
          msg.senderId !== user?._id ? "ms-5" : "text-end pe-5"
        }`}
        style={{ minWidth: "max-content" }}
      >
        {msg?.replyTo && <FontAwesomeIcon icon={faReply as IconProp} />}{" "}
        {pin && "Đã ghim"}
        {pin && msg?.replyTo && " - "}
        {msg?.replyTo &&
          (msg.senderId === user?._id
            ? msg.replyTo.senderId === user?._id
              ? "Bạn đã nhắc lại tin nhắn của mình"
              : `Bạn đã trả lời ${recipientUser?.fullname}`
            : msg.replyTo.senderId === user?._id
            ? `${recipientUser?.fullname} đã trả lời bạn`
            : `${recipientUser?.fullname} đã nhắc lại tin nhắn của họ`)}
      </span>
    </>
  );
};

export default LabelMessage;
