import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-[var(--radius-md)] border border-line bg-surface px-4 text-[1rem] text-ink placeholder:text-muted/70 " +
  "transition-colors focus:border-navy focus:outline-none focus-visible:outline-2 focus-visible:outline-teal aria-[invalid=true]:border-danger";

export function Field({
  label,
  error,
  hint,
  children,
  id,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
  id?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id: fieldId, "aria-invalid": !!error, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input">>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(control, "h-12", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<"textarea">>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} rows={4} className={cn(control, "py-3", className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<"select">>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        control,
        "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%235d6573%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pe-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

/** − / + participants counter. */
export function NumberStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  label: string;
}) {
  const btn = "grid size-10 place-items-center rounded-full border border-line text-navy transition hover:border-navy disabled:opacity-40";
  return (
    <div className="flex items-center gap-4" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Retirer une personne">
        <Minus className="size-4" aria-hidden />
      </button>
      <output className="tabular min-w-6 text-center text-lg font-semibold" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Ajouter une personne">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
