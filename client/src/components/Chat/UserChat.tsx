/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser.js";
import { User } from "../../types/auth.js";
import Avatar from "../Avatar.js";
import { ChatContext } from "../../context/ChatContext.js";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage.js";
import moment from "moment";
import { unReadNotificationsFunc } from "../../utils/unReadNotificationsFunc.js";
import { MessageContext } from "../../context/MessageContext.js";
import { useTheme } from "../../context/ThemeContext.js";

interface UserChatProps {
  chat: Chat;
  user: User | null;
  isSelected: boolean;
  updateCurrentChat: (chat: Chat) => void;
  previousChat?: Chat | boolean;
  nextChat?: Chat | boolean;
}

const UserChat: React.FC<UserChatProps> = ({
  chat,
  user,
  isSelected,
  updateCurrentChat,
  previousChat,
  nextChat,
}) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(ChatContext)!;
  const { notifications, markThisUserNotificationsAsRead } =
    useContext(MessageContext)!;
  const { isDarkTheme } = useTheme();

  const { latestMessage } = useFetchLatestMessage(chat);

  const unReadNotifications = unReadNotificationsFunc(notifications);
  const thisUserNotification = unReadNotifications?.filter(
    (n: any) => n.senderId === recipientUser?._id
  );

  const truncateText = (text: string) => {
    const lengthShortText =
      latestMessage?.senderId === recipientUser?._id ? 20 : 16;
    let shortText = text.substring(0, lengthShortText);

    if (text.length > lengthShortText) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  useEffect(() => {
    const chatItems = document.querySelectorAll(".item-user-chat");
    chatItems.forEach((chatItem) => {
      (chatItem as HTMLElement).style.transition = "none";
    });
    setTimeout(() => {
      chatItems.forEach((chatItem) => {
        (chatItem as HTMLElement).style.transition =
          "background-color 0.3s ease, border-radius 0.3s ease,border-left 0.3s ease";
      });
    }, 100);
  }, [isDarkTheme]);

  return (
    <div
      style={{
        backgroundColor: isDarkTheme
          ? "rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)) !important"
          : "#e9ecf5",
        cursor: "pointer",
      }}
      onClick={() => {
        if (thisUserNotification?.length !== 0) {
          markThisUserNotificationsAsRead(thisUserNotification, notifications);
        }
      }}
    >
      <div
        className={`item-user-chat d-flex align-items-center gap-2 position-relative py-2 px-3 ${
          isSelected ? "selected" : ""
        } ${isDarkTheme ? "theme-dark bg-black" : "bg-white"}`}
        onClick={() => updateCurrentChat(chat)}
        style={{
          borderRadius: previousChat
            ? "0 50px 0 0"
            : nextChat
            ? "0 0 50px 0"
            : "0",
          backgroundColor: isDarkTheme ? "black !important" : "",
        }}
      >
        <div>
          <Avatar user={recipientUser} />
          <div
            className={`position-absolute rounded-circle ${
              !onlineUsers?.some(
                (user) => user?.userId === recipientUser?._id
              ) && "d-none"
            }`}
            style={{
              width: "15px",
              height: "15px",
              top: "43px",
              left: "51px",
              backgroundColor: "#31a24c",
            }}
          ></div>
        </div>
        <div className="flex-grow-1 pe-5">
          <span className="fw-bold">{recipientUser?.fullname}</span>
          <div>
            {latestMessage?.type && (
              <>
                <span className="fa-sm">
                  {latestMessage?.senderId !== recipientUser?._id && "Bạn: "}{" "}
                  {latestMessage?.type === "text" &&
                    truncateText(latestMessage?.text)}{" "}
                  {latestMessage?.type === "image" && "Đã gửi một ảnh"}{" "}
                  {latestMessage?.type === "video" && "Đã gửi một video"}{" "}
                  {latestMessage?.type === "file" && "Đã gửi một file"}{" "}
                  {latestMessage?.type === "call" &&
                    latestMessage?.text.includes("missed") &&
                    "Cuộc gọi nhỡ"}{" "}
                  {latestMessage?.type === "call" &&
                    !latestMessage?.text.includes("missed") &&
                    "Kết thúc cuộc gọi"}{" "}
                </span>
                <span className="message-footer fa-sm">
                  - {moment(latestMessage?.createdAt).fromNow()}
                </span>
              </>
            )}
          </div>
        </div>
        {thisUserNotification?.length > 0 && (
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "15px",
              height: "15px",
              top: "50%",
              right: "36px",
              transform: "translateY(-50%)",
              backgroundColor: "#2e89ff",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default UserChat;
