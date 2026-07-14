import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { sendRequest } from "../utils/requests";
import { useAuth } from "./AuthUserContext";
import UserStatus from "../enums/user-status";
import { emitEvent } from "../utils/socket-client";

const UserStatusContext = createContext(null);

export function UserStatusProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(UserStatus.ONLINE);

  const statusRef = useRef(status);

  useEffect(() => {
    if (!user) return;

    let idleTimer;

    updateStatus(UserStatus.ONLINE);

    const handleVisibilityChange = () => {
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

    // Clear event listeners and timer
    return () => {
      clearTimeout(idleTimer);
      ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(e =>
        window.removeEventListener(e, resetIdleTimer)
      );

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const updateStatus = useCallback((newStatus) => {
    if (!user || !UserStatus.containsStatus(newStatus)) return;
    if (newStatus === UserStatus.OFFLINE || statusRef.current === newStatus) return;
    
    statusRef.current = newStatus;
    setStatus(newStatus);

    sendRequest(`/users/${user.uid}/status`, 'POST', { status: newStatus })
      .catch((err) => console.error('Failed to update user status:', err));

    emitEvent('status_change', newStatus);
  }, [user]);

  return (
    <UserStatusContext.Provider value={{ status, updateStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
}