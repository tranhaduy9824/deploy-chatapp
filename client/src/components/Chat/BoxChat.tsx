/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Users from "./Users";
import {
  faVideo,
  faEllipsisH,
  faStickyNote,
  faPaperPlane,
  faTimes,
  faCamera,
  faCheck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { faImages, faSmile } from "@fortawesome/free-regular-svg-icons";
import Message from "./Message";
import Picker, { EmojiClickData } from "emoji-picker-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../Avatar";
import { MessageContext } from "../../context/MessageContext";
import moment from "moment";
import backgroundImage from "../../assets/background-chat.png";
import MediaPreview from "./MediaPreview";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Camera from "./Camera";
import { useNotification } from "../../context/NotificationContext";
import useIsMobile from "../../hooks/useIsMobile";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useTheme } from "../../context/ThemeContext";

function BoxChat({
  showInfoChat,
  setShowInfoChat,
  setIsCalling,
  recipientUser,
}: any) {
  const [page, setPage] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [replyingTo, setReplyingTo] = useState<null | Message>(null);
  const [edit, setEdit] = useState<null | Message>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputMessageRef = useRef<HTMLInputElement | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showUsers, setShowUsers] = useState(false);
  const [chatBubbleTransform, setChatBubbleTransform] = useState(
    "translate3d(0, 0, 0)"
  );

  const { user } = useContext(AuthContext)!;
  const { currentChat, onlineUsers, socket } = useContext(ChatContext)!;
  const {
    messages,
    sendTextMessage,
    getMessages,
    hasMore,
    replyToMessage,
    editMessage,
    typingUser,
    handleTyping,
    handleStopTyping,
  } = useContext(MessageContext)!;
  const { addNotification } = useNotification();
  const isMobile = useIsMobile();
  const { isDarkTheme } = useTheme();

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (attachedFile) {
      const sendFile = async () => {
        scrollToBottom();
        if (replyingTo) {
          await replyToMessage(
            replyingTo._id,
            "",
            attachedFile,
            setMediaPreview
          );
          setReplyingTo(null);
          setEdit(null);
        } else {
          await sendTextMessage(
            "",
            user,
            currentChat?._id || "",
            attachedFile,
            setMediaPreview
          );
        }
        setAttachedFile(null);
      };
      sendFile();
    }
  }, [attachedFile]);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      if (edit) {
        editMessage(edit._id, message);
      } else if (replyingTo) {
        replyToMessage(replyingTo._id, message, attachedFile || undefined);
      } else {
        sendTextMessage(
          message,
          user,
          currentChat?._id || "",
          attachedFile || undefined
        );
      }
      setMessage("");
      setReplyingTo(null);
      setEdit(null);
      scrollToBottom();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (
    event: EmojiClickData,
    emojiObject?: EmojiClickData
  ) => {
    setMessage(message + (emojiObject?.emoji || event.emoji));
  };

  const timeDiffInMinutes = (date1: Date, date2: Date): number => {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setEdit(null);
    setReplyingTo(null);
    setPage(1);
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      getMessages(page, 10);
    }
  }, [currentChat, page]);

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const chatMessagesElement = chatMessagesRef.current;
    if (chatMessagesElement) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = chatMessagesElement;
        if (clientHeight - scrollTop >= scrollHeight - 1) {
          loadMoreMessages();
        }
      };

      chatMessagesElement.addEventListener("scroll", handleScroll);
      return () => {
        chatMessagesElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasMore, loadMoreMessages, currentChat]);

  useEffect(() => {
    if (inputMessageRef.current) {
      inputMessageRef.current.focus();
    }
  }, [replyingTo, edit]);

  const handleReplyClick = async (messageId: string) => {
    const findMessage = () => document.getElementById(messageId);

    let targetMessage = findMessage();
    while (!targetMessage && hasMore) {
      await new Promise((resolve) => {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          setTimeout(resolve, 400);
          return nextPage;
        });
      });
      targetMessage = findMessage();
    }

    if (targetMessage) {
      targetMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      targetMessage.classList.add("highlight");
      setTimeout(() => {
        targetMessage.classList.remove("highlight");
      }, 2000);
    }
  };

  const handleCapturePhoto = (file: File) => {
    setAttachedFile(file);
    setShowCamera(false);
  };

  const handleStartCall = () => {
    try {
      if (currentChat) {
        setIsCalling(true);
        socket.emit("startCall", {
          chatId: currentChat?._id,
          userId: user?._id,
          userName: user?.fullname,
          userAvatar: user?.avatar,
          members: Array.isArray(currentChat?.members)
            ? currentChat.members
            : [],
          offer: undefined,
        });
      }
    } catch (error: any) {
      addNotification("Error starting call:", error);
    }
  };

  useEffect(() => {
    if (isMobile) {
      gsap.registerPlugin(Draggable);
      if (!showUsers) {
        gsap.to("#chatBubble", {
          transform: chatBubbleTransform,
          top: "auto",
          right: "auto",
          duration: 0.5,
        });

        Draggable.create("#chatBubble", {
          bounds: {
            minX: -27,
            minY: -85,
            maxX: window.innerWidth - 77,
            maxY: window.innerHeight - 140,
          },
          onDragEnd: function () {
            const transform = window.getComputedStyle(this.target).transform;
            setChatBubbleTransform(transform);
          },
        });
      } else {
        Draggable.get("#chatBubble")?.disable();
      }
    }
  }, [showUsers, isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (showUsers) {
        gsap.to("#chatBubble", {
          transform: "translate3d(0, 0, 0)",
          top: "85px",
          right: "20px",
          duration: 0.5,
        });
      }

      gsap.to(".users-container", {
        y: showUsers ? "0%" : "-100%",
        opacity: showUsers ? 1 : 0,
        duration: 0.5,
      });
    }
  }, [showUsers, isMobile]);

  return (
    <div
      className={`flex-grow-1 h-100 p-3 overflow-hidden d-flex justify-content-between ${
        isDarkTheme ? "bg-dark text-light" : ""
      }`}
      style={{
        borderRadius: "var(--border-radius)",
        backgroundColor: "#e9ecf5",
      }}
    >
      {isMobile ? (
        <div
          className="users-container z-2"
          style={{
            position: "absolute",
            left: "10px",
            top: showUsers ? "145px" : "-100%",
            right: "0",
            bottom: "0",
            opacity: 0,
            transition: "top 0.5s",
          }}
        >
          <Users />
        </div>
      ) : (
        <Users />
      )}
      {!currentChat ? (
        <div
          className={`flex-grow-1 d-flex flex-column align-items-center justify-content-center ${
            isDarkTheme ? "text-light" : ""
          }`}
          style={{ paddingLeft: isMobile ? "0" : "16px" }}
        >
          <h3>Welcome to ChatApp</h3>
          <img
            src={backgroundImage}
            alt="Background image"
            className="w-50 rounded-5 mt-2"
          />
        </div>
      ) : (
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{ paddingLeft: isMobile ? "0" : "16px" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 position-relative">
              <Avatar
                user={recipientUser}
                style={{
                  boxShadow: !isDarkTheme
                    ? "var(--bg-primary-gentle) 0px 8px 24px, var(--bg-primary-gentle) 0px 16px 56px, var(--bg-primary-gentle) 0px 24px 80px"
                    : "#c2d6ff63 0px 8px 24px, #c2d6ff63 0px 16px 56px, #c2d6ff63 0px 24px 80px",
                }}
              />
              <div
                className={`position-absolute rounded-circle ${
                  !onlineUsers?.some(
                    (user) => user?.userId === recipientUser?._id
                  ) && "d-none"
                }`}
                style={{
                  width: "15px",
                  height: "15px",
                  top: "35px",
                  left: "35px",
                  backgroundColor: "#31a24c",
                }}
              ></div>
              <div>
                <p className="fw-bold m-0">{recipientUser?.fullname}</p>
                <span className="message-footer fa-sm">
                  {onlineUsers?.some(
                    (user) => user?.userId === recipientUser?._id
                  )
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Tippy content="Bắt đầu gọi video" placement="bottom">
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2.1rem", height: "2.1rem" }}
                  onClick={handleStartCall}
                >
                  <FontAwesomeIcon
                    icon={faVideo as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
              <Tippy content="Thông tin về cuộc trò truyện" placement="bottom">
                <span
                  className={`icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                    showInfoChat && "selected"
                  }`}
                  style={{ width: "2.1rem", height: "2.1rem" }}
                  onClick={() => setShowInfoChat(!showInfoChat)}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisH as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
            </div>
          </div>
          <div
            className="chat-messages flex-grow-1 overflow-x-hidden overflow-y-auto py-3 gap-2"
            ref={chatMessagesRef}
          >
            {typingUser && (
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-end me-2 mt-auto"
                  style={{ width: "35px", height: "100%" }}
                >
                  <Avatar user={recipientUser} width={35} height={35} />
                </div>
                <div
                  className="typing-indicator d-flex align-items-center message position-relative border border-secondary bg-white"
                  style={{
                    borderRadius: "50px 50px 50px 0",
                    padding: "8px",
                  }}
                >
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </div>
            )}
            <div className="d-flex flex-column-reverse gap-2">
              {mediaPreview && (
                <MediaPreview
                  type={
                    attachedFile?.type.startsWith("image/")
                      ? "image"
                      : attachedFile?.type.startsWith("video/")
                      ? "video"
                      : "file"
                  }
                  mediaPreview={mediaPreview}
                  replyingTo={replyingTo}
                  handleReplyClick={handleReplyClick}
                />
              )}
              {messages?.map((msg, index) => {
                const showTimestamp =
                  index === messages?.length - 1 ||
                  (messages[index + 1]?.createdAt &&
                    msg?.createdAt &&
                    timeDiffInMinutes(
                      new Date(messages[index + 1].createdAt),
                      new Date(msg.createdAt)
                    ) >= 10);
                const showAvatar =
                  messages[index - 1]?.senderId !== msg.senderId ||
                  timeDiffInMinutes(
                    new Date(msg?.createdAt),
                    new Date(messages[index - 1]?.createdAt)
                  ) >= 10;

                return (
                  <div key={index}>
                    {showTimestamp && (
                      <div
                        className={`text-center small my-2 fw-bold ${
                          isDarkTheme ? "text-light" : "text-muted"
                        }`}
                      >
                        {moment(msg.createdAt).calendar()}
                      </div>
                    )}
                    <Message
                      key={index}
                      msg={msg}
                      recipientUser={recipientUser}
                      showAvatar={showAvatar}
                      setReplyingTo={setReplyingTo}
                      setEdit={setEdit}
                      handleReplyClick={handleReplyClick}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {(replyingTo || edit) && !mediaPreview && (
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ padding: "10px 0 5px", borderTop: "1px solid #7e889c" }}
            >
              <>
                <div>
                  <div className="fw-bold">
                    {edit ? "Chỉnh sửa tin nhắn" : "Đang trả lời"}{" "}
                    {!edit &&
                      (replyingTo?.senderId !== user?._id
                        ? recipientUser?.fullname
                        : "Chính mình")}
                  </div>
                  <div className="small">
                    {replyingTo?.type === "video"
                      ? "Video"
                      : replyingTo?.type === "image"
                      ? "Hình ảnh"
                      : replyingTo?.type === "file"
                      ? "File đính kèm"
                      : replyingTo?.type === "call"
                      ? replyingTo.text.includes("missed")
                        ? "Cuộc gọi nhỡ"
                        : "Kết thúc cuộc gọi"
                      : replyingTo?.text}
                  </div>
                </div>
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => {
                    setReplyingTo(null);
                    setEdit(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes as IconProp} />
                </span>
              </>
            </div>
          )}
          <div className="d-flex align-items-center pt-2">
            <div className="d-flex align-items-center gap-2">
              <Tippy content="Chụp ảnh">
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2.1rem", height: "2.1rem" }}
                  onClick={() => setShowCamera(true)}
                >
                  <FontAwesomeIcon
                    icon={faCamera as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
              <Tippy content="Đính kèm file">
                <label
                  htmlFor="file-upload"
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faImages as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </label>
              </Tippy>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Tippy content="Chọn file gif">
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2.1rem", height: "2.1rem" }}
                >
                  <FontAwesomeIcon
                    icon={faStickyNote as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
            </div>
            <div className="position-relative flex-grow-1 mx-3">
              <input
                type="text"
                className="form-control rounded-pill me-2"
                style={{ paddingRight: "38px" }}
                placeholder="Enter message..."
                value={edit ? edit.text : message}
                ref={inputMessageRef}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (edit) {
                    setEdit((prevEdit) =>
                      prevEdit ? { ...prevEdit, text: newValue } : null
                    );
                  }
                  setMessage(newValue);
                }}
                onFocus={() => setShowEmojiPicker(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleStopTyping();
                    handleSendMessage();
                  } else {
                    handleTyping();
                  }
                }}
                onBlur={handleStopTyping}
              />
              <Tippy content="Chọn biểu tượng cảm xúc">
                <span
                  className={`position-absolute top-0 end-0 icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                    showEmojiPicker && "selected"
                  }`}
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <FontAwesomeIcon
                    icon={faSmile as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
              {showEmojiPicker && (
                <div
                  className="position-absolute bottom-100 end-0 mb-2"
                  style={{ zIndex: 1000 }}
                  ref={emojiPickerRef}
                >
                  <Picker
                    onEmojiClick={(emojiObject) =>
                      handleEmojiClick(emojiObject)
                    }
                  />
                </div>
              )}
            </div>
            <button
              className="btn btn-primary rounded-pill"
              style={{ height: "100%", width: "auto", aspectRatio: "1/1" }}
              onClick={handleSendMessage}
            >
              {!edit ? (
                <FontAwesomeIcon icon={faPaperPlane as IconProp} />
              ) : (
                <FontAwesomeIcon icon={faCheck as IconProp} />
              )}
            </button>
          </div>
        </div>
      )}
      {showCamera && (
        <Camera
          onCapture={handleCapturePhoto}
          onClose={() => setShowCamera(false)}
          setMediaPreview={setMediaPreview}
        />
      )}
      {isMobile && (
        <span
          id="chatBubble"
          className="position-absolute icon-hover d-flex align-items-center justify-content-center rounded-circle text-white p-3 z-2"
          style={{
            width: "3.2rem",
            height: "3.2rem",
            backgroundColor: "rgb(234, 103, 164)",
          }}
          onClick={() => {
            setShowUsers(!showUsers);
          }}
        >
          <FontAwesomeIcon
            icon={faUsers as IconProp}
            style={{ fontSize: "24px" }}
          />
        </span>
      )}
    </div>
  );
}

export default BoxChat;
