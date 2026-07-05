import { createContext, useContext, useEffect, useState } from "react";
import initializeSocket, { disconnectSocket } from "./utils/socket-client";
import { getAccessToken, setAccessToken } from "./utils/token-store";

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

  const login = (userData, accessToken) => {
    console.log("Logging in user:", userData);
    console.log("Access token:", accessToken);
    setUser(userData);
    setAccessToken(accessToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem("user");
    disconnectSocket();
  };

  return (
    <AuthUserContext.Provider value={{ user, accessToken: getAccessToken(), login, logout }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthUserContext);
}
