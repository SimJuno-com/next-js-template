"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@next-js-template/ui/components/button";
import { Input } from "@next-js-template/ui/components/input";
import { cn } from "@next-js-template/ui/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@next-js-template/ui/components/field";

export function FloatingInput({
  label,
  hint,
  errors,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
  errors: Array<{ message?: string } | undefined>;
}) {
  const [visible, setVisible] = useState(false);
  const password = props.type === "password";
  const invalid = errors.length > 0;
  const descriptions = [hint && `${props.id}-hint`, invalid && `${props.id}-error`]
    .filter(Boolean)
    .join(" ");
  return (
    <Field data-invalid={invalid}>
      <div className="relative">
        <Input
          {...props}
          type={password && visible ? "text" : props.type}
          placeholder=" "
          className={cn(
            "peer h-12 px-4 py-3 focus-visible:border-primary focus-visible:ring-0",
            password && "pr-12",
            className,
          )}
          aria-invalid={invalid}
          aria-describedby={descriptions || undefined}
        />
        <FieldLabel
          htmlFor={props.id}
          className={cn(
            "pointer-events-none absolute top-3 left-4 font-normal text-muted-foreground transition-all duration-200 motion-reduce:transition-none",
            "peer-focus:-top-2.5 peer-focus:left-3 peer-focus:bg-background peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs",
            "peer-disabled:opacity-50 peer-aria-invalid:text-destructive",
          )}
        >
          {label}
        </FieldLabel>
        {password && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1.5 right-1.5 size-9"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </Button>
        )}
      </div>
      {hint && (
        <FieldDescription id={`${props.id}-hint`} className="text-xs">
          {hint}
        </FieldDescription>
      )}
      <FieldError id={`${props.id}-error`} errors={errors} />
    </Field>
  );
}
