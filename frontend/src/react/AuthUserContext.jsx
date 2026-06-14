
import { createContext, useContext, useEffect, useState } from "react";
import initializeSocket, { disconnectSocket } from "./utils/socket-client";

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const userSessionData = sessionStorage.getItem("user");
  if(!userSessionData || userSessionData === "undefined") {
    sessionStorage.removeItem("user");
  }

  const [user, setUser] = useState(JSON.parse(userSessionData));

  useEffect(() => {
    if (!user) return;
    
    initializeSocket();
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    // initializeSocket();
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    disconnectSocket();
  };

  return (
    <AuthUserContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthUserContext);
}
