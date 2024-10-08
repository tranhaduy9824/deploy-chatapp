import {
  faBell,
  faBellSlash,
  faImages,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faFileAlt,
  faSearch,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontIcon } from "../Icons";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function InfoChat() {
  return (
    <div
      className="h-100 p-3 ms-3 d-flex flex-column align-items-center"
      style={{
        minWidth: "300px",
        borderRadius: "var(--border-radius)",
        backgroundColor: "#e9ecf5",
      }}
    >
      <img
        src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
        alt="Duy"
        className="rounded-circle mr-3"
        width={72}
        height={72}
        style={{
          boxShadow:
            "var(--bg-primary-gentle) 0px 8px 24px, var(--bg-primary-gentle) 0px 16px 56px, var(--bg-primary-gentle) 0px 24px 80px",
        }}
      />
      <p className="fw-bold mt-2 mb-0" style={{ fontSize: "1.4rem" }}>
        Trần Hà Duy
      </p>
      <span className="small text-secondary mb-4">Đang hoạt động</span>
      <div className="d-flex align-items-center justify-content-center gap-2">
        <Tippy content="Tắt thông báo">
          <div
            className="icon-info-chat"
            style={{
              backgroundColor: "#eeddf5",
            }}
          >
            <FontAwesomeIcon
              icon={faBell as IconProp}
              style={{ color: "#97803d", cursor: "pointer" }}
            />
          </div>
        </Tippy>
        <Tippy content="Tìm kiếm">
          <div
            className="icon-info-chat"
            style={{
              backgroundColor: "#eeddf5",
            }}
          >
            <FontAwesomeIcon
              icon={faSearch as IconProp}
              style={{ color: "#97803d", cursor: "pointer" }}
            />
          </div>
        </Tippy>
      </div>
      <div className="item-info-chat w-100 mt-3 rounded-5 overflow-hidden">
        <div style={{ backgroundColor: "#dee4ed" }}>
          <div style={{ backgroundColor: "#eaf1f5" }}>
            <FontAwesomeIcon icon={faThumbTack as IconProp} style={{ color: "#888fa0" }} />
          </div>
          Xem tin nhắn đã ghim
        </div>
        <div style={{ backgroundColor: "#dee4ed" }}>
          <div style={{ backgroundColor: "#eaf1f5" }}>
            <FontIcon style={{ fill: "currentColor", color: "#888fa0" }} />
          </div>{" "}
          Chỉnh sửa biệt danh
        </div>
        <div style={{ backgroundColor: "#dee4ed" }}>
          <div style={{ backgroundColor: "#eaf1f5" }}>
            <FontAwesomeIcon
              icon={faImages as IconProp}
              style={{ color: "#888fa0" }}
            />
          </div>{" "}
          File phương tiện
        </div>
        <div style={{ backgroundColor: "#dee4ed" }}>
          <div style={{ backgroundColor: "#eaf1f5" }}>
            <FontAwesomeIcon icon={faFileAlt as IconProp} style={{ color: "#888fa0" }} />
          </div>{" "}
          File
        </div>
      </div>
      <div className="item-info-chat w-100 mt-3 rounded-5 overflow-hidden">
        <div style={{ backgroundColor: "#f5e0e0" }}>
          <div style={{ backgroundColor: "#f5eeed" }}>
            <FontAwesomeIcon icon={faBellSlash as IconProp} style={{ color: "#c2a9aa" }} />
          </div>{" "}
          Tắt thông báo
        </div>
        <div style={{ backgroundColor: "#f5e0e0" }}>
          <div style={{ backgroundColor: "#f5eeed" }}>
            <FontAwesomeIcon icon={faBan as IconProp} style={{ color: "#c2a9aa" }} />
          </div>{" "}
          Chặn
        </div>
      </div>
    </div>
  );
}

export default InfoChat;
