import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Check, Info, X } from 'lucide-react';

type Notify = (message: string, error?: boolean) => void;
const NoticeContext = createContext<Notify>(() => {});
export const useStudioNotice = () => useContext(NoticeContext);

export function StudioNoticeProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<{ message: string; error: boolean }>();
  const timer = useRef<number | undefined>(undefined);
  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setNotice(undefined);
  }, []);
  const show: Notify = useCallback(
    (message, error = false) => {
      window.clearTimeout(timer.current);
      if (!message) {
        dismiss();
        return;
      }
      setNotice({ message, error });
      if (!error) timer.current = window.setTimeout(dismiss, 6000);
    },
    [dismiss],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <NoticeContext.Provider value={show}>
      {children}
      <div className="studio-notice-anchor">
        <div
          role="status"
          className={notice && !notice.error ? 'studio-notice' : undefined}
        >
          {notice && !notice.error && (
            <>
              <Check size={18} aria-hidden="true" />
              <span>{notice.message}</span>
              <button type="button" aria-label="Fechar aviso" onClick={dismiss}>
                <X size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        <div
          role="alert"
          className={notice?.error ? 'studio-notice' : undefined}
        >
          {notice?.error && (
            <>
              <Info size={18} aria-hidden="true" />
              <span>{notice.message}</span>
              <button type="button" aria-label="Fechar aviso" onClick={dismiss}>
                <X size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </NoticeContext.Provider>
  );
}
