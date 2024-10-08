import { useContext, useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { MessageContext } from "../context/MessageContext";

interface FetchLatestMessageProps {
  latestMessage: Message | null;
}

export const useFetchLatestMessage = (
  chat: Chat | null
): FetchLatestMessageProps => {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const { newMessage, notifications, messages } = useContext(MessageContext)!;

  useEffect(() => {
    const getMessages = async () => {
      if (!chat) return;

      const response: { messages?: Message[]; error?: string } =
        await getRequest(
          `${baseUrl}/messages/${chat._id}?page=1&limit=10`,
          undefined,
          true
        );

      if (response.error) {
        console.error("Error getting messages:", response.error);
        return;
      }

      if (response.messages && response.messages.length > 0) {
        const reverseMessage = response.messages.reverse();
        const lastMessage = reverseMessage[reverseMessage.length - 1];
        setLatestMessage(lastMessage);
      }
    };

    getMessages();
  }, [chat, newMessage, notifications, messages]);

  return { latestMessage };
};
