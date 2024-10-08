export interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar: string;
  token: string,
}

export interface RegisterInfo {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: RegisterInfo) => void;
  registerUser: (e: React.FormEvent) => Promise<void>;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  loginUser: (e: React.FormEvent) => Promise<void>;
  loginInfo: LoginInfo;
  updateLoginInfo: (info: LoginInfo) => void;
  isLoginLoading: boolean;
  updateAvatar: (file: File) => Promise<void>;
  updateUser: (data: object, handleChangePWSuccess?: () => void) => Promise<void>;
  socket: Socket;
  setSocket: React.Dispatch<React.SetStateAction<Socket>>;
}
