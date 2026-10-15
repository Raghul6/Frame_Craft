import type { AlertProps } from "../../types/components";

/** Inline error box (page / form level). Success messages use the common toast instead. */
const Alert = ({ children }: AlertProps) => (
  <div className="alert alert-error" role="alert">
    {children}
  </div>
);

export default Alert;
