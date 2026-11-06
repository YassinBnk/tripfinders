import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/cn";

/** Accessible modal on top of the native <dialog>: focus trap, Esc to close, focus restored. */
export function Modal({
  open,
  onClose,
  title,
  children,
  side = "center",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "center" | "bottom";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className={cn(
        "m-auto w-[min(100%-2rem,36rem)] rounded-[var(--radius-card)] bg-surface p-0 text-ink shadow-[var(--shadow-lift)] backdrop:bg-navy/50 backdrop:backdrop-blur-sm",
        side === "bottom" && "mb-0 max-h-[90dvh] w-full max-w-none rounded-b-none sm:mb-auto sm:w-[min(100%-2rem,36rem)] sm:rounded-b-[var(--radius-card)]",
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-lg">{title}</h2>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-sand-200" aria-label="Fermer">
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="max-h-[75dvh] overflow-y-auto px-6 py-5">{children}</div>
    </dialog>
  );
}

/** Tabs with roving focus (arrow keys). */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-full bg-sand-200 p-1 [scrollbar-width:none]">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
            onChange(tabs[next]!.id);
            refs.current[next]?.focus();
          }}
          className={cn(
            "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
            value === t.id ? "bg-surface text-navy shadow-[var(--shadow-soft)]" : "text-muted hover:text-navy",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="tabular rounded-full bg-sand px-2 text-xs">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- Toasts ---------- */

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm text-white shadow-[var(--shadow-lift)]">
            <CheckCircle2 className="size-4 text-mint" aria-hidden /> {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
