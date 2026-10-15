import { Link, useNavigate } from "react-router-dom";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import ListPanel from "../../../components/admin/ListPanel";
import ListToolbar from "../../../components/admin/ListToolbar";
import StatusBadge from "../../../components/common/StatusBadge";
import { ROLE_FILTER_OPTIONS } from "../../../constants/admin";
import { selectUsersList } from "../../../features/users/selectors";
import { fetchUsers } from "../../../features/users/thunks";
import { useAdminList } from "../../../hooks/useAdminList";
import { formatDate, formatMoney } from "../../../utils/format";
import { EMPTY_MESSAGES } from "../../../constants/messages";
import { EMPTY_VALUE } from "../../../constants/ui";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { list, ...filters } = useAdminList({
    selectList: selectUsersList,
    fetchList: fetchUsers,
    filterKey: "role",
  });

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Users"
        description="Customer and admin accounts."
      />

      <ListToolbar
        searchValue={filters.searchInput}
        searchPlaceholder="Search username, email or mobile"
        onSearchChange={filters.setSearchInput}
        onSearchSubmit={filters.submitSearch}
        filter={{
          label: "Role",
          value: filters.filter,
          onChange: filters.setFilter,
          options: ROLE_FILTER_OPTIONS,
        }}
      />

      <ListPanel
        list={list}
        onPageChange={filters.setPage}
        emptyText={EMPTY_MESSAGES.usersFiltered}
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((u) => (
                <tr
                  key={u.id}
                  className="clickable"
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                >
                  <td data-label="User" className="cell-strong">
                    <Link
                      to={`/admin/users/${u.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {u.username}
                    </Link>
                  </td>
                  <td data-label="Contact">
                    {u.email ?? u.mobile ?? EMPTY_VALUE}
                  </td>
                  <td data-label="Role">
                    <StatusBadge value={u.role} />
                  </td>
                  <td data-label="Orders">{u.orderCount}</td>
                  <td data-label="Spent">{formatMoney(u.totalSpent)}</td>
                  <td data-label="Joined">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListPanel>
    </div>
  );
};

export default AdminUsersPage;
