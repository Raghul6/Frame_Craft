import type { InputHTMLAttributes, ReactNode } from "react";
import type { FilterOption, OrderSummary } from "./admin";
import type { SizeRow } from "./forms";
import type { ListState, RequestStatus } from "./api";
import type { UserRole } from "./auth";

// ---------- common ----------

export interface SpinnerProps {
  /** Centre the spinner in a tall block (page / route loading). */
  full?: boolean;
}

export interface AlertProps {
  variant?: "error" | "success";
  children: ReactNode;
}

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export interface PasswordStrengthMeterProps {
  password: string;
}

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onChange: (page: number) => void;
}

export interface StatusBadgeProps {
  /** Order status, user role, or 'active' / 'inactive' for frames. */
  value: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** When this value changes (e.g. the URL), a shown error is cleared and children re-render. */
  resetKey?: string;
  /** Smaller fallback for use inside a layout, so the navbar/sidebar stays usable. */
  inline?: boolean;
}

export interface ErrorBoundaryState {
  error: Error | null;
}

// ---------- admin ----------

export interface AdminPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export interface ListToolbarProps {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  filter?: {
    label: string;
    value: string;
    options: readonly FilterOption[];
    onChange: (value: string) => void;
  };
  actions?: ReactNode;
}

export interface ListPanelProps<T> {
  list: ListState<T>;
  emptyText: ReactNode;
  onPageChange: (page: number) => void;
  children: ReactNode;
}

export interface DetailShellProps {
  backTo: string;
  backLabel: string;
  status: RequestStatus;
  error: string | null;
  /** True once the record for the current URL is in the store. */
  ready: boolean;
  children: ReactNode;
}

export interface OrdersTableProps {
  orders: OrderSummary[];
  emptyText: string;
  /** Hide the customer column, e.g. on a single user's page. */
  hideCustomer?: boolean;
}

export interface SizeRowEditorProps {
  row: SizeRow;
  index: number;
  /** Errors for this row, keyed by field (width, height, price, stock). */
  errors: Partial<Record<keyof SizeRow, string>>;
  onChange: (key: string, patch: Partial<SizeRow>) => void;
  onRemove: (key: string) => void;
}

// ---------- routes ----------

export interface ProtectedRouteProps {
  roles?: UserRole[];
}

export interface RoleBasedRouteProps {
  requiredRoles: UserRole[];
  children: ReactNode;
}
