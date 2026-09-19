import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Single page-level toast ("status-dot" + mono message, bottom-right).
 *
 * Lives above the router so both the shared shell (login/logout, nav "coming
 * soon") and the individual pages (filters, catalog actions) push messages
 * into one queue instead of each page owning its own <div className="toast">.
 */
interface ToastContextType {
  notice: string;
  notify: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState("");
  const timer = useRef<number>(undefined);

  const notify = useCallback((message: string) => {
    setNotice(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 2600);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ notice, notify }}>
      {children}
      {notice && (
        <div className="toast">
          <span className="status-dot" /> {notice}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
