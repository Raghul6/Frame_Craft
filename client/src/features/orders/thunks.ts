import type { Dispatch } from "@reduxjs/toolkit";
import api from "../../api/api";
import { API_ENDPOINTS } from "../../constants/api";
import type {
  OrderDetail,
  OrderDetailResponse,
  OrderStatus,
  OrderSummary,
} from "../../types/admin";
import type { ListQuery, Paginated } from "../../types/api";
import { extractError, isAbortError } from "../../utils/apiError";
import { createLatestRequest, toQueryParams } from "../shared/latestRequest";
import {
  orderDetailFail,
  orderDetailStart,
  orderDetailSuccess,
  ordersFail,
  ordersStart,
  ordersSuccess,
  orderStatusFail,
  orderStatusStart,
  orderStatusSuccess,
} from "./slice";

const listRequest = createLatestRequest();
const detailRequest = createLatestRequest();

export const fetchOrders = (query: ListQuery) => async (dispatch: Dispatch) => {
  const controller = listRequest.start();
  try {
    dispatch(ordersStart());
    const response = await api.get<Paginated<OrderSummary>>(
      API_ENDPOINTS.adminOrders,
      { params: toQueryParams(query), signal: controller.signal },
    );
    dispatch(ordersSuccess(response.data));
    return response.data;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(ordersFail(extractError(error, "Could not load orders")));
  } finally {
    listRequest.finish(controller);
  }
};

export const fetchOrder = (id: number) => async (dispatch: Dispatch) => {
  const controller = detailRequest.start();
  try {
    dispatch(orderDetailStart(id));
    const response = await api.get<OrderDetailResponse>(
      API_ENDPOINTS.adminOrder(id),
      { signal: controller.signal },
    );
    dispatch(orderDetailSuccess(response.data.order));
    return response.data.order;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(orderDetailFail(extractError(error, "Could not load this order")));
  } finally {
    detailRequest.finish(controller);
  }
};

export const changeOrderStatus =
  (id: number, status: OrderStatus) =>
  async (dispatch: Dispatch): Promise<OrderDetail | undefined> => {
    try {
      dispatch(orderStatusStart());
      const response = await api.patch<OrderDetailResponse>(
        API_ENDPOINTS.adminOrderStatus(id),
        { status },
      );
      dispatch(orderStatusSuccess(response.data.order));
      return response.data.order;
    } catch (error) {
      dispatch(
        orderStatusFail(extractError(error, "Could not update the status")),
      );
    }
  };
