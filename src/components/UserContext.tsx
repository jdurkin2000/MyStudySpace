"use client";
import bcrypt from "bcryptjs";
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
  password: string;
  email: string;
};

type ContextType = {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
  signup: (newUser: User) => void;
};

const UserContext = createContext<ContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const signup = (userData: User) => {
    const hashed = bcrypt.hashSync(userData.password);
    const newUser = {
      email: userData.email,
      password: hashed
    }

    console.log(JSON.stringify(newUser));
  }

  const login = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    // redirect to home page
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("called");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    signup({email: "fmekosf", password: "greenbeans"})
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, signup }}>
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
