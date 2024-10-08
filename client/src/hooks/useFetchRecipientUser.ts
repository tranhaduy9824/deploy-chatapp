import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { User } from "../types/auth";

export const useFetchRecipientUser = (
  chat: Chat | null,
  user: User | null
): {
  recipientUser: User | null;
} => {
  const [recipientUser, setRecipientUser] = useState<User | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    const newRecipientId = chat?.members?.find((id) => id !== user?._id) || null;
    if (newRecipientId !== recipientId) {
      setRecipientId(newRecipientId);
    }
  }, [chat, user, recipientId]);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      try {
        const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
        if (response.error) {
          console.log(response.message);
        } else {
          setRecipientUser(response);
        }
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
