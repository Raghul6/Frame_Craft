import type { StatusBadgeProps } from "../../types/components";

const StatusBadge = ({ value }: StatusBadgeProps) => (
  <span className={`status-badge status-${value}`}>{value}</span>
);

export default StatusBadge;
