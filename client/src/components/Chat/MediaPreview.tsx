import { faFileText } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";
import { formatCallDuration } from "../../utils/format";

interface MediaPreviewProps {
  mediaPreview: string;
  type: "image" | "video" | "file";
  replyingTo: null | Message;
  handleReplyClick: (id: string) => void;
}

function MediaPreview({
  mediaPreview,
  type,
  replyingTo,
  handleReplyClick,
}: MediaPreviewProps) {
  const { user } = useContext(AuthContext)!;

  return (
    <div>
      {replyingTo && (
        <div
          className="d-flex align-items-center message position-relative pb-3 ms-auto"
          style={{
            width: "max-content",
            maxWidth: "75%",
            marginBottom: "-16px",
            marginRight: "43px",
            borderRadius: "50px 50px 0 50px ",
            backgroundColor:
              replyingTo.type === "text" ||
              replyingTo.type === "file" ||
              replyingTo.type === "call"
                ? "#dce2f0"
                : "",
            padding:
              replyingTo.mediaUrl && replyingTo.type !== "file"
                ? "0px !important"
                : "8px",
          }}
          onClick={() => handleReplyClick(replyingTo._id)}
        >
          {replyingTo.type === "text" && (
            <p className="m-0">{replyingTo.text}</p>
          )}
          {replyingTo.type === "image" && (
            <img
              src={replyingTo.mediaUrl}
              alt="media"
              style={{
                maxWidth: "140px",
                maxHeight: "160px",
                marginBottom: "-16px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          )}
          {replyingTo.type === "video" && (
            <video
              src={replyingTo.mediaUrl}
              style={{
                maxWidth: "140px",
                maxHeight: "160px",
                marginBottom: "-16px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          )}
          {replyingTo.type === "file" && (
            <a className="text-decoration-none text-black d-flex align-items-center">
              <span className="mx-2">
                <FontAwesomeIcon
                  icon={faFileText as IconProp}
                  style={{
                    fontSize: "14px",
                    marginBottom: "-16px",
                    opacity: 0.5,
                  }}
                />
              </span>
              <div className="d-flex flex-column">
                <span className="fw-bold">Tải về tập tin</span>
                <span className="small">1.8 KB</span>
              </div>
            </a>
          )}
          {replyingTo.type === "call" && (
            <div className="d-flex align-items-center text-black">
              <FontAwesomeIcon
                icon={
                  replyingTo.text.includes("missed")
                    ? (faPhoneSlash as IconProp)
                    : (faPhone as IconProp)
                }
                className="mx-2"
              />
              <span className="fw-bold">
                {replyingTo.text.includes("missed") ? (
                  "Cuộc gọi nhỡ"
                ) : (
                  <>
                    Kết thúc cuộc gọi{" "}
                    <div className="fw-normal">
                      {formatCallDuration(replyingTo?.callDuration)}
                    </div>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="position-relative item-message d-flex align-items-start justify-content-end">
        <div
          className="d-flex align-items-center bg-white message position-relative"
          style={{
            maxWidth: "75%",
            borderRadius: "50px 50px 0 50px ",
            border: type === "file" ? "1px solid #ea67a4" : "",
            padding: type === "file" ? "8px" : "",
          }}
        >
          {type === "image" ? (
            <img
              src={mediaPreview}
              alt="media"
              style={{
                maxWidth: "280px",
                maxHeight: "300px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
              className="message-media"
            />
          ) : type === "video" ? (
            <video
              src={mediaPreview}
              controls
              style={{
                maxWidth: "280px",
                maxHeight: "300px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
              className="message-media"
            />
          ) : type === "file" ? (
            <a
              href={mediaPreview}
              download
              className="text-decoration-none text-black d-flex align-items-center"
              style={{ opacity: 0.5 }}
            >
              <span className="mx-2">
                <FontAwesomeIcon
                  icon={faFileText as IconProp}
                  style={{ fontSize: "20px" }}
                />
              </span>
              <div className="d-flex flex-column">
                <span className="fw-bold">Tải về tập tin</span>
                <span className="small">1.8 KB</span>
              </div>
            </a>
          ) : null}
        </div>
        <div
          className="d-flex align-items-end ms-2 mt-auto"
          style={{ width: "35px", height: "100%" }}
        >
          <Avatar user={user} width={35} height={35} />
        </div>
      </div>
    </div>
  );
}

export default MediaPreview;
