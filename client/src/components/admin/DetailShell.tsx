import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { DetailShellProps } from "../../types/components";
import Alert from "../common/Alert";
import DetailSkeleton from "./DetailSkeleton";
import { ICON_SIZE } from "../../constants/ui";

/** Back link + loading (shimmer placeholder) / error states shared by every admin detail page. */
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
      <ArrowLeft size={ICON_SIZE.md} /> {backLabel}
    </Link>
    {status === "failed" && error ? (
      <Alert>{error}</Alert>
    ) : ready ? (
      children
    ) : (
      <DetailSkeleton />
    )}
  </div>
);

export default DetailShell;
