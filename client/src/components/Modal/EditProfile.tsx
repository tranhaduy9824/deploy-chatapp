/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import WrapperModal from "../WrapperModal";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../Avatar";
import { Button } from "react-bootstrap";
import { useNotification } from "../../context/NotificationContext";
import validator from "validator";
import { useTheme } from "../../context/ThemeContext";

interface EditProfileProps {
  show: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ show, onClose }) => {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);

  const { user, updateAvatar, updateUser } = useContext(AuthContext)!;
  const { addNotification } = useNotification();
  const { isDarkTheme } = useTheme();

  const resetInfo = () => {
    setFullname(user?.fullname || "");
    setEmail(user?.email || "");
  };

  const handleChangePWSuccess = () => {
    setIsChangePasswordMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  useEffect(() => {
    resetInfo();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) {
      addNotification("Fullname cannot be empty", "info");
      return;
    } else if (!email.trim()) {
      addNotification("Email cannot be empty", "info");
      return;
    }
    const data = { fullname, email };
    await updateUser(data);
    resetInfo();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim()) {
      addNotification("Please fill in all fields completely", "info");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      addNotification("Passwords do not match", "info");
      return;
    }

    if (!validator.isStrongPassword(newPassword)) {
      addNotification("Password must be a strong password", "info");
      return;
    }

    const data = { currentPassword: currentPassword, password: newPassword };
    await updateUser(data, handleChangePWSuccess);
  };

  return (
    <>
      {!isChangePasswordMode && (
        <WrapperModal show={show} onClose={onClose}>
          <div className="p-2" style={{ width: "350px" }}>
            <h4>Edit Profile</h4>
            <form onSubmit={handleProfileSubmit}>
              <div className="my-3 text-center">
                <label
                  htmlFor="avatar-upload"
                  className="d-block position-relative avatar-upload"
                >
                  <Avatar user={user} width={150} height={150} />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-center text-white bg-dark opacity-50 rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      cursor: "pointer",
                      display: "none",
                    }}
                  >
                    <span className="d-block">+</span>
                  </div>
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="fullname" className="form-label">
                  Fullname
                </label>
                <input
                  type="text"
                  id="fullname"
                  className={`form-control ${
                    isDarkTheme ? "bg-dark text-light" : ""
                  }`}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${
                    isDarkTheme ? "bg-dark text-light" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  variant="primary"
                  type="button"
                  style={{
                    border: "2px solid rgb(234, 103, 164)",
                    backgroundColor: isDarkTheme ? "black" : "white",
                    color: isDarkTheme ? "white" : "black",
                  }}
                  onClick={() => setIsChangePasswordMode(true)}
                >
                  Change Password
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    border: "2px solid var(--bg-primary-gentle)",
                    backgroundColor: isDarkTheme ? "black" : "white",
                    color: isDarkTheme ? "white" : "black",
                  }}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </WrapperModal>
      )}

      {isChangePasswordMode && (
        <WrapperModal
          show={show}
          onClose={() => setIsChangePasswordMode(false)}
        >
          <div className="p-2" style={{ width: "350px" }}>
            <h4>Change Password</h4>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label htmlFor="current-password" className="form-label">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  className={`form-control ${
                    isDarkTheme ? "bg-dark text-light" : ""
                  }`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="new-password" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  className={`form-control ${
                    isDarkTheme ? "bg-dark text-light" : ""
                  }`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className={`form-control ${
                    isDarkTheme ? "bg-dark text-light" : ""
                  }`}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  variant="secondary"
                  className="me-2"
                  style={{
                    border: "2px solid rgb(234, 103, 164)",
                    color: isDarkTheme ? "white" : "black",
                    backgroundColor: isDarkTheme ? "black" : "white",
                  }}
                  onClick={() => setIsChangePasswordMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    border: "2px solid var(--bg-primary-gentle)",
                    color: isDarkTheme ? "white" : "black",
                    backgroundColor: isDarkTheme ? "black" : "white",
                  }}
                >
                  Update password
                </Button>
              </div>
            </form>
          </div>
        </WrapperModal>
      )}
    </>
  );
};

export default EditProfile;
