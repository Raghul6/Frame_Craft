import type { OrderStatus, SizeUnit } from "./admin";

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export interface RegisterFormErrors {
  username?: string;
  contact?: string;
  password?: string;
  confirmPassword?: string;
}

/** A size row in the frame form. `key` is only for React; `id` is set for sizes that already exist. */
export interface SizeRow {
  key: string;
  id?: number;
  label: string;
  width: string;
  height: string;
  unit: SizeUnit;
  price: string;
  stock: string;
}

export interface FrameFormState {
  name: string;
  description: string;
  material: string;
  color: string;
  imageUrl: string;
  isActive: boolean;
  sizes: SizeRow[];
}

/** Status picked on the order page but not saved yet, tied to the order it was picked for. */
export interface OrderStatusDraft {
  id: number;
  status: OrderStatus;
}

/** Order-history page on the user detail screen, tied to the user it belongs to. */
export interface OrderPaging {
  id: number | null;
  page: number;
}
