/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { User } from "../types/auth";
import { useLoading } from "./LoadingContext";
import { useNotification } from "./NotificationContext";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
  user,
}) => {
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [potentialChats, setPotentialChats] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { setProgress } = useLoading();
  const { addNotification } = useNotification();

  const { socket } = useContext(AuthContext)!;

  useEffect(() => {
    if (socket === null || !user?._id) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res: any) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`, setProgress);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u: User) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        const response = await getRequest(
          `${baseUrl}/chats/${user?._id}`,
          setProgress
        );

        if (response.error) {
          return addNotification(response.messsage, "error");
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  const updateCurrentChat = useCallback((chat: Chat | null) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId: string, secondId: string) => {
      try {
        const newMembersString = [firstId, secondId].sort().join(",");

        const existingChat = userChats?.find(
          (chat) => chat.members.sort().join(",") === newMembersString
        );

        if (existingChat) {
          updateCurrentChat(existingChat);
          return;
        }

        const response = await postRequest(`${baseUrl}/chats`, {
          firstId,
          secondId,
        });

        if (response.error) {
          console.log("Error creating chat", response);
          return;
        }

        setUserChats((prev) => [response, ...(prev || [])]);

        updateCurrentChat(response);
      } catch (error) {
        console.log("Error creating chat", error);
      }
    },
    [userChats, updateCurrentChat]
  );

  useEffect(() => {
    updateCurrentChat(null);
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        allUsers,
        onlineUsers,
        socket,
        setCurrentChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
