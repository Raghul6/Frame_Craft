import type { AlertProps } from "../../types/components";

const Alert = ({ variant = "error", children }: AlertProps) => (
  <div
    className={`alert alert-${variant}`}
    role={variant === "error" ? "alert" : "status"}
  >
    {children}
  </div>
);

export default Alert;
