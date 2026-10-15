import type {
  AdminUser,
  DashboardStats,
  Frame,
  OrderDetail,
  OrderSummary,
} from "./admin";
import type { FieldErrors, ListState, Paginated, RequestStatus } from "./api";
import type { User } from "./auth";

export interface AuthState {
  user: User | null;
  status: RequestStatus;
  /** False until the stored session has been checked on app start. */
  bootstrapped: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}

export interface DashboardState {
  stats: DashboardStats | null;
  status: RequestStatus;
  error: string | null;
}

export interface UsersState {
  list: ListState<AdminUser>;
  detail: {
    user: AdminUser | null;
    orders: Paginated<OrderSummary> | null;
    status: RequestStatus;
    error: string | null;
  };
}

export interface OrdersState {
  list: ListState<OrderSummary>;
  detail: {
    order: OrderDetail | null;
    status: RequestStatus;
    error: string | null;
  };
  statusUpdate: { status: RequestStatus; error: string | null };
}

export interface FramesState {
  list: ListState<Frame>;
  /** The frame loaded into the edit form. */
  current: { frame: Frame | null; status: RequestStatus; error: string | null };
  save: {
    status: RequestStatus;
    error: string | null;
    fieldErrors: FieldErrors;
  };
  remove: { id: number | null; error: string | null };
}
