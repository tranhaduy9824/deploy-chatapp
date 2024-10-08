/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  Notification,
  NotificationContextType,
  NotificationType,
} from "../types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType) => {
      const id = Date.now();
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id, message, type },
      ]);

      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
