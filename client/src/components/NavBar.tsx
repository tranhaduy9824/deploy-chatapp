import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./Notification";
import Avatar from "./Avatar";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import EditProfile from "./Modal/EditProfile";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ChatContext } from "../context/ChatContext";
import DarkModeToggle from "react-dark-mode-toggle";
import { useTheme } from "../context/ThemeContext";

function NavBar() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, logoutUser } = useContext(AuthContext)!;
  const { setCurrentChat } = useContext(ChatContext)!;
  const { isDarkTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const applyThemeToTippyBoxes = () => {
      const tippyBoxes = document.querySelectorAll(".tippy-box");
      tippyBoxes.forEach((box) => {
        const element = box as HTMLElement;
        if (isDarkTheme) {
          element.style.boxShadow =
            "#c2d6ff63 0px 8px 24px, #c2d6ff63 0px 16px 56px, #c2d6ff63 0px 24px 80px";
        } else {
          element.style.boxShadow =
            "var(--bg-primary-gentle) 0px 8px 24px, var(--bg-primary-gentle) 0px 16px 56px, var(--bg-primary-gentle) 0px 24px 80px";
        }
      });
    };

    const observer = new MutationObserver(applyThemeToTippyBoxes);
    observer.observe(document.body, { childList: true, subtree: true });

    // Apply theme initially
    applyThemeToTippyBoxes();

    return () => observer.disconnect();
  }, [isDarkTheme]);

  return (
    <>
      <Navbar
        bg={isDarkTheme ? "dark" : "light"}
        className="mb-2 rounded-pill px-2 m-auto navbar"
        style={{ maxWidth: "1296px", height: "3.25rem" }}
      >
        <Container>
          <h3 className="mb-0">
            <NavLink
              to="/"
              onClick={() => setCurrentChat(null)}
              className={`${
                isDarkTheme ? "link-light" : "link-dark"
              } text-decoration-none fw-bold`}
            >
              <FontAwesomeIcon
                icon={faComments as IconProp}
                className=" me-2"
              />
              <span className="d-none d-md-inline">Chat</span>
            </NavLink>
          </h3>
          {user && (
            <span
              className={`${isDarkTheme ? "link-light" : "link-dark"} fw-bold`}
            >
              <span className="d-none d-md-inline">Logged in as </span>
              {user?.fullname}
            </span>
          )}
          <Nav>
            <Stack direction="horizontal" gap={3}>
              <DarkModeToggle
                onChange={toggleTheme}
                checked={isDarkTheme}
                size={60}
                className="me-2"
              />
              {user ? (
                <>
                  <Notification />
                  <Tippy
                    interactive
                    content={
                      <div
                        className={`p-2 d-flex flex-column ${
                          isDarkTheme ? "bg-dark text-light" : ""
                        }`}
                      >
                        <span
                          className="fw-bold p-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowEditProfile(true)}
                        >
                          Edit profile
                        </span>
                        <NavLink
                          onClick={() => {
                            logoutUser();
                          }}
                          to="/login"
                          className={`text-decoration-none fw-bold p-2 ${
                            isDarkTheme ? "link-light" : "link-dark"
                          }`}
                        >
                          Logout
                        </NavLink>
                      </div>
                    }
                    delay={[0, 500]}
                  >
                    <span>
                      <Avatar user={user} width={35} height={35} />
                    </span>
                  </Tippy>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`text-decoration-none fw-bold ${
                      isDarkTheme ? "link-light" : "link-dark"
                    } "`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={`text-decoration-none fw-bold ${
                      isDarkTheme ? "link-light" : "link-dark"
                    } "`}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </Stack>
          </Nav>
        </Container>
      </Navbar>
      <EditProfile
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </>
  );
}

export default NavBar;
