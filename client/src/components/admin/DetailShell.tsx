import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { DetailShellProps } from "../../types/components";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";

/** Back link + loading / error states shared by every admin detail page. */
const DetailShell = ({
  backTo,
  backLabel,
  status,
  error,
  ready,
  children,
}: DetailShellProps) => (
  <div className="admin-page">
    <Link to={backTo} className="admin-back">
      <ArrowLeft size={16} /> {backLabel}
    </Link>
    {status === "failed" && error ? (
      <Alert>{error}</Alert>
    ) : ready ? (
      children
    ) : (
      <Spinner full />
    )}
  </div>
);

export default DetailShell;
