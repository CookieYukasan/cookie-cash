import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";
import { parseCookies, setCookie } from "nookies";
import Router from "next/router";
import { userFormatter } from "../utils/userFormatter";

export type User = {
  id: string;
  username: string;
  email: string;
  balance: number;
  readableBalance: string;
};

type AuthContextData = {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>;
};

type SignInCredentials = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export const authToken = "access_token";

async function recoverUserInformation() {
  const { data } = await api.get("me");
  return data;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { access_token: token } = parseCookies();

    if (token) {
      recoverUserInformation().then((response) => {
        setUser(userFormatter(response));
      });
    }
  }, []);

  async function signIn(credentials: SignInCredentials) {
    const { data } = await api.post("login", credentials);

    setUser(userFormatter(data));
    setCookie(undefined, authToken, data.token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    Router.push("/dashboard");
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
