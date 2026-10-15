import type { FormFieldProps } from "../../types/components";

/** Label + control + error/hint — the markup every form field repeats. */
const FormField = ({
  id,
  label,
  error,
  hint,
  className,
  children,
}: FormFieldProps) => (
  <div className={className ? `form-field ${className}` : "form-field"}>
    <label htmlFor={id}>{label}</label>
    {children}
    {error ? (
      <span className="field-error" id={`${id}-error`}>
        {error}
      </span>
    ) : (
      hint && <span className="field-hint">{hint}</span>
    )}
  </div>
);

export default FormField;
