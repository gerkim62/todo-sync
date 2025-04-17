import isOnline from "is-online";
import { useEffect, useState, useCallback, useRef } from "react";

export enum NETWORKSTATUS {
  ONLINE = "online",
  OFFLINE = "offline",
  CHECKING = "checking",
}

export interface OnlineStatusResult {
  status: NETWORKSTATUS;
  isOnline: boolean;
  isChecking: boolean;
  checkNow: () => void;
}

export function useOnlineStatus(): OnlineStatusResult {
  const [status, setStatus] = useState<NETWORKSTATUS>(NETWORKSTATUS.CHECKING);
  // useRef to track in-flight checks without re-rendering
  const checkingRef = useRef<boolean>(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (checkingRef.current) {
      return false;
    }
    checkingRef.current = true;
    setStatus(NETWORKSTATUS.CHECKING);

    // shortcut if browser already knows we're offline
    if (!navigator.onLine) {
      setStatus(NETWORKSTATUS.OFFLINE);
      checkingRef.current = false;
      return false;
    }

    try {
      const online = await isOnline();
      setStatus(online ? NETWORKSTATUS.ONLINE : NETWORKSTATUS.OFFLINE);
      return online;
    } catch {
      // on error conservatively assume offline
      setStatus(NETWORKSTATUS.OFFLINE);
      return false;
    } finally {
      checkingRef.current = false;
    }
  }, []); // <- no isChecking dependency

  useEffect(() => {
    // auto‑recheck when browser fires online/offline
    const onOnline = () => void checkConnection();
    const onOffline = () => setStatus(NETWORKSTATUS.OFFLINE);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // initial check
    void checkConnection();

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [checkConnection]);

  return {
    status,
    isOnline: status === NETWORKSTATUS.ONLINE,
    isChecking: status === NETWORKSTATUS.CHECKING,
    checkNow: () => {
      void checkConnection();
    },
  };
}

export default useOnlineStatus;
