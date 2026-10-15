import type { ComponentType, InputHTMLAttributes, ReactNode } from "react";
import type { FilterOption, OrderSummary } from "./admin";
import type { SizeRow } from "./forms";
import type { ListState, RequestStatus } from "./api";
import type { UserRole } from "./auth";
import type { Toast } from "./toast";

// ---------- common ----------

export interface SpinnerProps {
  /** Centre the spinner in a tall block (page / route loading). */
  full?: boolean;
}

export interface AlertProps {
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
  /** Columns in the placeholder table shown on first load. */
  /** Placeholder columns on first load (defaults to ADMIN_TABLE_COLUMNS). */
  skeletonColumns?: number;
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

export interface ProtectedRoutesProps {
  component: ComponentType;
  roles: readonly UserRole[];
  /** Page name → browser tab title. Omitted on layout routes, so the page's own name wins. */
  name?: string;
}

export interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  /** Label while the action runs, e.g. "Deleting…". */
  busyLabel?: string;
  /** Red confirm button for destructive actions (delete). */
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SkeletonProps {
  /** Placeholder shape: a text line, a short line, a heading, a block, a square thumbnail or a badge. */
  shape: "line" | "line-short" | "title" | "block" | "thumb" | "badge";
}

export interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export interface ButtonLabelProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}
