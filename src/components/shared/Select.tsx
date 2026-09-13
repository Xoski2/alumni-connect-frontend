import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  label?: string;
  error?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  containerClassName,
  label,
  error,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = React.useId();
  const resolvedId = id ?? selectId;
  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={resolvedId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={resolvedId}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            (!value || value === "") && "text-muted-foreground",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}