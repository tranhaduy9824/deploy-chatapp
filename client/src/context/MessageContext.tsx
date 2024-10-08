/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  baseUrl,
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../utils/services";
import { useNotification } from "./NotificationContext";
import { ChatContext } from "./ChatContext";
import { User } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { useLoading } from "./LoadingContext";
import notificationSound from "../assets/sound_notification.mp3";

export const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [newMessage, setNewMessage] = useState<Message[] | null>(null);
  const [notifications, setNotifications] = useState<Message[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const { currentChat, socket, updateCurrentChat } = useContext(ChatContext)!;
  const { user } = useContext(AuthContext)!;
  const { setProgress } = useLoading();

  const { addNotification } = useNotification();

  const getMessages = useCallback(
    async (page: number, limit: number) => {
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}?page=${page}&limit=${limit}`,
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMessages((prevMessages) => [
        ...(prevMessages ?? []),
        ...response.messages,
      ]);
      setHasMore(response.hasMore);
    },
    [currentChat, addNotification]
  );

  useEffect(() => {
    setMessages([]);
  }, [currentChat]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, user, socket, currentChat]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res: Message) => {
      if (res.type !== "call" && currentChat?._id !== res.chatId) {
        return;
      }

      setMessages((prev) => {
        if (prev && prev[0]?._id === res._id) {
          return prev;
        }
        return [res, ...(prev || [])];
      });
    });

    socket.on(
      "messageReaction",
      (data: { messageId: string; reaction: string; senderId: string }) => {
        const { messageId, reaction, senderId } = data;

        setMessages(
          (prevMessages) =>
            prevMessages?.map((msg) =>
              msg._id === messageId
                ? {
                    ...msg,
                    reactions: [
                      ...(msg.reactions?.filter(
                        (r: any) => r.userId === senderId
                      ) || []),
                      { userId: senderId, reaction },
                    ],
                  }
                : msg
            ) || []
        );
      }
    );

    socket.on("messageReply", (res: Message) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [res, ...(prev || [])]);
    });

    socket.on("messageDeleted", (messageId: string) => {
      setMessages((prev) => prev?.filter((msg) => msg._id !== messageId) || []);
    });

    socket.on("messageEdited", (data: { messageId: string; text: string }) => {
      const { messageId, text } = data;

      setMessages(
        (prev) =>
          prev?.map((msg) =>
            msg._id === messageId ? { ...msg, text } : msg
          ) || []
      );
    });

    socket.on("getNotifications", (res: Message) => {
      if (!res.senderId) {
        return;
      }

      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...(prev || [])]);
      } else {
        setNotifications((prev) => [res, ...(prev || [])]);
        playNotificationSound();
      }
    });

    socket.on("typing", (data: { userId: string; chatId: string }) => {
      if (data.chatId !== currentChat?._id) return;

      if (data.userId !== user?._id) {
        setTypingUser(data.userId);
      }
    });

    socket.on("stopTyping", (data: { userId: string; chatId: string }) => {
      if (data.chatId !== currentChat?._id) return;

      if (data.userId !== user?._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("messageReaction");
      socket.off("messageReply");
      socket.off("getNotifications");
      socket.off("messageDeleted");
      socket.off("messageEdited");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, currentChat, user]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: User,
      currentChatId: string,
      file?: File,
      setMediaPreview?: (preview: null) => void
    ) => {
      if (!textMessage && !file)
        return console.log("You must type something or attach a file...");

      const formData = new FormData();
      formData.append("chatId", currentChatId);
      formData.append("senderId", sender._id);
      formData.append("text", textMessage);

      if (file) {
        formData.append("file", file);
      }

      const response = await postRequest(
        `${baseUrl}/messages`,
        formData,
        file ? setProgress : undefined,
        true,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMediaPreview?.(null);
      setNewMessage(response);
      setMessages((prev) => [response, ...(prev || [])]);
    },
    [addNotification, setProgress]
  );

  const reactToMessage = useCallback(
    async (messageId: string, reaction: string) => {
      if (socket) {
        socket.emit("reactToMessage", {
          messageId,
          reaction,
          members: currentChat?.members,
        });
      }

      const response = await patchRequest(
        `${baseUrl}/messages/react/${messageId}`,
        { reaction },
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMessages(
        (prevMessages) =>
          prevMessages?.map((msg) =>
            msg._id === messageId
              ? { ...msg, reactions: response.messageUpdate.reactions }
              : msg
          ) || []
      );
    },
    [currentChat, socket, addNotification]
  );

  const replyToMessage = useCallback(
    async (
      messageId: string,
      text: string,
      file?: File,
      setMediaPreview?: (preview: null) => void
    ) => {
      if (!text && !file)
        return addNotification(
          "You need to enter content or attach files...",
          "info"
        );

      const formData = new FormData();
      formData.append("text", text);
      formData.append("messageId", messageId);

      if (file) {
        formData.append("file", file);
      }

      const response = await postRequest(
        `${baseUrl}/messages/reply/${messageId}`,
        formData,
        file ? setProgress : undefined,
        true,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      if (socket) {
        socket.emit("replyToMessage", {
          message: response.newMessage,
          members: currentChat?.members,
        });
      }

      setMediaPreview?.(null);
    },
    [addNotification, setProgress, socket, currentChat]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      const response = await deleteRequest(
        `${baseUrl}/messages/${messageId}`,
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      if (socket) {
        socket.emit("deleteMessage", {
          messageId,
          members: currentChat?.members,
        });
      }

      setMessages((prev) => prev?.filter((msg) => msg._id !== messageId) || []);
    },
    [addNotification, socket, currentChat]
  );

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      const response = await patchRequest(
        `${baseUrl}/messages/edit/${messageId}`,
        { text: newText },
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      if (socket) {
        socket.emit("editMessage", {
          messageId,
          text: newText,
          members: currentChat?.members,
        });
      }

      setMessages(
        (prev) =>
          prev?.map((msg) =>
            msg._id === messageId ? { ...msg, text: newText } : msg
          ) || []
      );
    },
    [addNotification, socket, currentChat]
  );

  const markAllNotificationsAsRead = useCallback((notifications: Message[]) => {
    const mNotifications = notifications.map((n) => ({ ...n, isRead: true }));

    setNotifications(mNotifications);
  }, []);

  const martNotificationAsRead = useCallback(
    (n: any, userChats: Chat[], user: User, notifications: Message[]) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member: any) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      const mNotification = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      if (desiredChat) {
        updateCurrentChat(desiredChat);
      }
      setNotifications(mNotification);
    },
    [updateCurrentChat]
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications: any, notifications: Message[]) => {
      const mNotifications = notifications?.map((el) => {
        let notification = el;

        thisUserNotifications.forEach((n: any) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          }
        });

        return notification;
      });

      setNotifications(mNotifications);
    },
    []
  );

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        chatId: currentChat?._id,
        userId: user?._id,
        members: currentChat?.members,
      });
    }
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit("stopTyping", {
        chatId: currentChat?._id,
        userId: user?._id,
        members: currentChat?.members,
      });
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendTextMessage,
        newMessage,
        notifications,
        markAllNotificationsAsRead,
        martNotificationAsRead,
        markThisUserNotificationsAsRead,
        getMessages,
        hasMore,
        reactToMessage,
        replyToMessage,
        deleteMessage,
        editMessage,
        typingUser,
        handleTyping,
        handleStopTyping,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
