import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      try {
        // Wait for auth to be ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (auth) {
          unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(
              "Auth state changed:",
              user ? "User logged in" : "User logged out",
            );
            setUser(user);
            setLoading(false);
          });
        } else {
          console.error("Auth not initialized");
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth setup error:", error);
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
