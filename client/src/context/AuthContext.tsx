/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { baseUrl, patchRequest, postRequest } from "../utils/services";
import { AuthContextType, User, RegisterInfo, LoginInfo } from "../types/auth";
import { useLoading } from "./LoadingContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./NotificationContext";
import { io, Socket } from "socket.io-client";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null | any>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    fullname: "",
    email: "",
    password: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const { setProgress } = useLoading();
  const { addNotification } = useNotification();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("User");

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const registerUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsRegisterLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        registerInfo,
        setProgress
      );

      setIsRegisterLoading(false);

      if (!response.error) {
        addNotification("Register success", "success");
        setRegisterInfo({
          fullname: "",
          email: "",
          password: "",
        });
        navigate("/login");
      } else {
        addNotification(response.message, "error");
      }
    },
    [registerInfo, setProgress, navigate, addNotification]
  );

  const loginUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoginLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        loginInfo,
        setProgress
      );

      setIsLoginLoading(false);

      if (!response.error) {
        addNotification("Login success", "success");
        setLoginInfo({
          email: "",
          password: "",
        });
        navigate("/");

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
      } else {
        addNotification(response.message, "error");
      }
    },
    [loginInfo, setProgress, navigate, addNotification]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
    socket?.disconnect();
  }, [socket]);

  const updateAvatar = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await patchRequest(
        `${baseUrl}/users/avatar`,
        formData,
        setProgress,
        true,
        true
      );

      if (!response.error) {
        localStorage.setItem(
          "User",
          JSON.stringify({ ...user, avatar: response.avatar })
        );
        setUser({ ...user, avatar: response.avatar });
        addNotification("Update avatar success", "success");
      } else {
        addNotification(response.message, "error");
      }
    },
    [addNotification, setProgress, user]
  );

  const updateUser = useCallback(
    async (data: object, handleChangePWSuccess?: () => void) => {
      const response = await patchRequest(
        `${baseUrl}/users/`,
        data,
        setProgress,
        true
      );

      if (!response.error) {
        localStorage.setItem(
          "User",
          JSON.stringify({
            ...user,
            fullname: response.fullname,
            email: response.email,
          })
        );
        setUser({
          ...user,
          fullname: response.fullname,
          email: response.email,
        });
        if (handleChangePWSuccess) {
          handleChangePWSuccess();
          addNotification("Update password success", "success");
        } else {
          addNotification("Update info success", "success");
        }
      } else {
        addNotification(response.message, "error");
      }
    },
    [addNotification, setProgress, user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        isLoginLoading,
        updateLoginInfo,
        updateAvatar,
        updateUser,
        socket,
        setSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
