import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface WrapperModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  closeBtn?: boolean;
  outsideClick?: boolean;
}

const WrapperModal: React.FC<WrapperModalProps> = ({
  show,
  onClose,
  children,
  className = "",
  style = {},
  closeBtn = true,
  outsideClick = true,
}) => {
  const [showModal, setShowModal] = useState(show);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleClose = () => {
    if (outsideClick) {
      setShowModal(false);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 z-3 vw-100 vh-100 d-flex align-items-center justify-content-center"
      style={{
        visibility: show || showModal ? "visible" : "hidden",
        transition: "visibility 0.8s ease-in-out",
      }}
      onClick={handleClose}
    >
      <div
        className={`position-relative p-3 rounded-3 ${className} ${isDarkTheme ? "text-light bg-dark" : "bg-light"}`}
        style={{
          boxShadow: !isDarkTheme
            ? "var(--bg-primary-gentle) 0px 8px 24px, var(--bg-primary-gentle) 0px 16px 56px, var(--bg-primary-gentle) 0px 24px 80px"
            : "#c2d6ff63 0px 8px 24px, #c2d6ff63 0px 16px 56px, #c2d6ff63 0px 24px 80px",
          transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
          transform: showModal ? "scale(1)" : "scale(0)",
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {closeBtn && (
          <span
            className="position-absolute"
            style={{
              top: "16px",
              right: "16px",
              cursor: "pointer",
              color: "rgb(234, 103, 164)",
            }}
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faTimes as IconProp}
              style={{ fontSize: "22px" }}
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default WrapperModal;
