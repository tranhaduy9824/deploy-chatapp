export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
}