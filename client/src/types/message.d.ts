/* eslint-disable @typescript-eslint/no-explicit-any */
interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  mediaUrl: string;
  type: string;
  reactions: array;
  replyTo: Message | null;
  createdAt: string;
  callDuration?: number | null;
  infoFile: {
    name: string;
    size: number;
  };
}

interface MessageContextProps {
  messages: Message[] | null;
  sendTextMessage: (
    textMessage: string,
    sender: User,
    currentChatId: string,
    file?: File,
    setMediaPreview?: (preview: null) => void
  ) => Promise<void>;
  newMessage: Message[] | null;
  notifications: Message[] | null;
  markAllNotificationsAsRead: any;
  martNotificationAsRead: any;
  markThisUserNotificationsAsRead: any;
  getMessages: (page: number, limit: number) => void;
  hasMore: boolean;
  reactToMessage: (messageId: string, reaction: string) => void;
  replyToMessage: (
    messageId: string,
    text: string,
    media?: File,
    setMediaPreview?: (preview: null) => void
  ) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, text: string) => void;
  typingUser: User | null;
  handleTyping: () => void;
  handleStopTyping: () => void;
}

interface MessageContextProviderProps {
  children: React.ReactNode;
}
