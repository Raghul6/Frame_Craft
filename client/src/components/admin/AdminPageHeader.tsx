import type { AdminPageHeaderProps } from "../../types/components";

const AdminPageHeader = ({
  title,
  description,
  actions,
}: AdminPageHeaderProps) => (
  <div className="admin-page-header">
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions}
  </div>
);

export default AdminPageHeader;
