import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { sendRequest } from "./utils/requests";
import { useAuth } from "./AuthUserContext";
import UserStatus from "../enums/user-status";

const UserStatusContext = createContext(null);

export function UserStatusProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(UserStatus.ONLINE);

  const apiKey = import.meta.env.VITE_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const statusRef = useRef(status);

  useEffect(() => {
    if (!user) return;

    let isUnloading = false;
    let idleTimer;

    updateStatus(UserStatus.ONLINE);

    const handleBeforeUnload = () => {
      isUnloading = true;
      
      navigator.sendBeacon(
        backendUrl + `/users/${user.uid}/status`,
        JSON.stringify({ status: "offline", 'x-api-key': apiKey, from_beacon: true }),
      );
    };

    const handleVisibilityChange = () => {
      if (isUnloading) return;
      updateStatus(document.hidden ? UserStatus.AWAY : UserStatus.ONLINE);
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (document.hidden) return;

      if(statusRef.current === UserStatus.AWAY) {
        updateStatus(UserStatus.ONLINE);
      }

      idleTimer = setTimeout(() => {
        updateStatus(UserStatus.AWAY);
      }, 3 * 60 * 1000);
    };

    ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
    resetIdleTimer();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clear event listeners and timer
    return () => {
      clearTimeout(idleTimer);
      ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(e =>
        window.removeEventListener(e, resetIdleTimer)
      );

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  const updateStatus = useCallback((newStatus) => {
    if (!user || !UserStatus.containsStatus(newStatus)) return;
    statusRef.current = newStatus;

    setStatus(newStatus);
    sendRequest(`/users/${user.uid}/status`, 'POST', { status: newStatus })
      .catch((err) => console.error('Failed to update user status:', err));
  }, [user]);

  return (
    <UserStatusContext.Provider value={{ status, updateStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
}