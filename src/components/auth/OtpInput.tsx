import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  className,
}: OtpInputProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit && raw !== "") return;

    const chars = value.split("");
    chars[index] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (digit && next.length === length) {
      onComplete?.(next);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = value.split("");
      if (chars[index]) {
        chars[index] = "";
        onChange(chars.join(""));
      } else if (index > 0) {
        chars[index - 1] = "";
        onChange(chars.join(""));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      inputsRef.current[Math.min(length - 1, pasted.length)]?.focus();
      if (pasted.length === length) onComplete?.(pasted);
    }
  };

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={value[index] ?? ""}
            disabled={disabled}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${index + 1}`}
            className={cn(
              "h-14 w-11 rounded-lg border-2 bg-background text-center text-xl font-bold text-foreground transition-colors focus:outline-none sm:h-16 sm:w-13 sm:flex-1",
              focusedIndex === index
                ? "border-brand-primary ring-2 ring-brand-primary/20"
                : "border-input",
              disabled && "opacity-50",
            )}
          />
        </React.Fragment>
      ))}
    </div>
  );
}