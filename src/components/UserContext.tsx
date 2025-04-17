"use client"
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type User = {
  username: string;
  password: string;
  email: string;
};

type ContextType = {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
};

const UserContext = createContext<ContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    // redirect to home page
    router.push("/");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("Cannot call useUser from outside a UserProvider");
  return context;
};
