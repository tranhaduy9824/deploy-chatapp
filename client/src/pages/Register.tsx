import { useContext, useEffect, useState } from "react";
import { Button, Form, FormGroup, Container, Col } from "react-bootstrap";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const [confirmPassword, setConfirmPassword] = useState("");

  const { registerInfo, updateRegisterInfo, registerUser, isRegisterLoading } =
    useContext(AuthContext)!;
  const { addNotification } = useNotification();
  const { isDarkTheme } = useTheme();

  const rotate = () => {
    gsap.to(".card", {
      duration: 0.8,
      opacity: 1,
      rotationY: 360,
      transformOrigin: "center center",
      ease: "power1",
    });
  };

  const animateBackground = (toGradient: string) => {
    gsap.to("#root", {
      duration: 0.8,
      backgroundImage: toGradient,
      ease: "power1.inOut",
    });
  };

  useEffect(() => {
    rotate();
    setTimeout(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const bgSubPrimary = rootStyles.getPropertyValue("--bg-primary").trim();
      const bgPrimary = rootStyles.getPropertyValue("--bg-sub-primary").trim();
      const gradient = `linear-gradient(45deg, ${bgPrimary}, ${bgSubPrimary})`;

      animateBackground(gradient);
    }, 100);

    return () => {
      rotate();
    };
  }, [isDarkTheme]);

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Col xs={12} sm={8} md={6} lg={4}>
        <div
          className={`card p-4 ${
            isDarkTheme ? "text-light bg-dark" : "bg-light"
          }`}
          style={{
            opacity: 0,
            transform: "rotateY(180deg)",
            borderRadius: "var(--border-radius)",
          }}
        >
          <h1 className="text-center mb-4 fw-bold">Register</h1>
          <Form>
            <FormGroup className="mb-2">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="fullname"
                name="fullname"
                id="fullname"
                placeholder="Enter fullname"
                className={`form-control ${
                  isDarkTheme ? "bg-dark text-light" : ""
                }`}
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    fullname: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                className={`form-control ${
                  isDarkTheme ? "bg-dark text-light" : ""
                }`}
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                className={`form-control ${
                  isDarkTheme ? "bg-dark text-light" : ""
                }`}
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="Confirm password"
                className={`form-control ${
                  isDarkTheme ? "bg-dark text-light" : ""
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
            <div className="d-grid gap-2 mb-3 mt-4">
              <Button
                variant="primary"
                type="submit"
                className={`fw-bold ${
                  isDarkTheme ? "bg-black text-light" : ""
                }`}
                style={{
                  border: "2px solid var(--bg-primary-gentle)",
                  backgroundColor: "white",
                  color: "var(--text-dark)",
                }}
                onClick={
                  isRegisterLoading
                    ? undefined
                    : (e) => {
                        if (registerInfo.password !== confirmPassword) {
                          e.preventDefault();
                          addNotification("Password does not match", "error");
                        } else {
                          registerUser(e);
                        }
                      }
                }
              >
                {isRegisterLoading ? "Loading..." : "Register"}
              </Button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              Already have an account?{" "}
              <Link to="/login" className="ms-1 text-decoration-none fw-bold">
                Login
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

export default Register;
