import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../context/NotificationContext";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const NotificationList = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.type === "error" && (
            <FontAwesomeIcon icon={faCircleXmark as IconProp} />
          )}{" "}
          {notification.type === "info" && (
            <FontAwesomeIcon icon={faCircleExclamation as IconProp} />
          )}{" "}
          {notification.type === "success" && (
            <FontAwesomeIcon icon={faCircleCheck as IconProp} />
          )}{" "}
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
