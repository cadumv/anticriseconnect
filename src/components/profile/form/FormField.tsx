
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  helperText?: string;
  disabled?: boolean;
}

export const FormField = ({
  id,
  label,
  children,
  helperText,
  disabled = false,
}: FormFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helperText && (
        <p className={`text-sm ${disabled ? "text-muted-foreground" : "text-muted-foreground"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
