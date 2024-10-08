import { useContext, useEffect } from "react";
import { Button, Form, FormGroup, Container, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const { loginUser, loginInfo, updateLoginInfo, isLoginLoading } =
    useContext(AuthContext)!;
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
      const gradient = `linear-gradient(45deg, ${bgSubPrimary}, ${bgPrimary})`;

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
          <h1 className="text-center mb-4 fw-bold">Login</h1>
          <Form>
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
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
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
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
            </FormGroup>
            <div className="d-grid gap-2 mb-4 mt-4">
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
                  isLoginLoading
                    ? (e) => {
                        e.preventDefault();
                      }
                    : loginUser
                }
              >
                {isLoginLoading ? "Loading..." : "Login"}
              </Button>
            </div>
            <div className="mb-3">
              <Button variant="facebook" className="btn btn-primary w-100 mb-2">
                <FontAwesomeIcon
                  icon={faFacebookF as IconProp}
                  className="me-2"
                />
                Login with Facebook
              </Button>
              <Button variant="google" className="btn btn-danger w-100">
                <FontAwesomeIcon icon={faGoogle as IconProp} className="me-2" />
                Login with Google
              </Button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="ms-1 text-decoration-none fw-bold"
              >
                Register
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

export default Login;
