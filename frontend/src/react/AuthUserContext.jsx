
import { createContext, useContext, useState } from "react";

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
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
