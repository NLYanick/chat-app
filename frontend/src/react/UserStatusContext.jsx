import { createContext, useContext, useState, useEffect } from "react";
import { sendRequest } from "./utils/requests";
import { useAuth } from "./AuthUserContext";

const UserStatusContext = createContext(null);

export function UserStatusProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState("online");

  const apiKey = import.meta.env.VITE_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user) return;

    let isUnloading = false;

    updateStatus("online");

    const handleBeforeUnload = () => {
      isUnloading = true;
      
      navigator.sendBeacon(
        backendUrl + `/users/${user.uid}/status`,
        JSON.stringify({ status: "offline", 'x-api-key': apiKey, from_beacon: true }),
      );
    };

    const handleVisibilityChange = () => {
      if (isUnloading) return;
      updateStatus(document.hidden ? "away" : "online");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  const updateStatus = (newStatus) => {
    if (!user || !["online", "away", "offline"].includes(newStatus)) return;

    setStatus(newStatus);
    sendRequest(`/users/${user.uid}/status`, 'POST', { status: newStatus })
      .catch((err) => console.error('Failed to update user status:', err));
  };

  return (
    <UserStatusContext.Provider value={{ status, updateStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
}