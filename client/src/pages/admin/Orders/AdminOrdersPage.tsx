import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import ListPanel from "../../../components/admin/ListPanel";
import ListToolbar from "../../../components/admin/ListToolbar";
import OrdersTable from "../../../components/admin/OrdersTable";
import { ORDER_FILTER_OPTIONS } from "../../../constants/admin";
import { selectOrdersList } from "../../../features/orders/selectors";
import { fetchOrders } from "../../../features/orders/thunks";
import { useAdminList } from "../../../hooks/useAdminList";

const AdminOrdersPage = () => {
  const { list, ...filters } = useAdminList({
    selectList: selectOrdersList,
    fetchList: fetchOrders,
    filterKey: "status",
  });

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Orders"
        description="Every order placed in the store. Open one to see its items and update its status."
      />

      <ListToolbar
        searchValue={filters.searchInput}
        searchPlaceholder="Search order # or customer"
        onSearchChange={filters.setSearchInput}
        onSearchSubmit={filters.submitSearch}
        filter={{
          label: "Status",
          value: filters.filter,
          onChange: filters.setFilter,
          options: ORDER_FILTER_OPTIONS,
        }}
      />

      <ListPanel
        list={list}
        onPageChange={filters.setPage}
        emptyText={
          filters.search || filters.filter
            ? "No orders match these filters."
            : "No orders yet."
        }
      >
        <OrdersTable orders={list.items} emptyText="" />
      </ListPanel>
    </div>
  );
};

export default AdminOrdersPage;
