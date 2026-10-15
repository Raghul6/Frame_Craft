import type { Dispatch } from "@reduxjs/toolkit";
import api from "../../api/api";
import { API_ENDPOINTS } from "../../constants/api";
import type { AdminUser, UserDetailResponse } from "../../types/admin";
import type { ListQuery, Paginated } from "../../types/api";
import { extractError, isAbortError } from "../../utils/apiError";
import { createLatestRequest, toQueryParams } from "../shared/latestRequest";
import {
  userDetailFail,
  userDetailStart,
  userDetailSuccess,
  usersFail,
  usersStart,
  usersSuccess,
} from "./slice";

const listRequest = createLatestRequest();
const detailRequest = createLatestRequest();

export const fetchUsers = (query: ListQuery) => async (dispatch: Dispatch) => {
  const controller = listRequest.start();
  try {
    dispatch(usersStart());
    const response = await api.get<Paginated<AdminUser>>(
      API_ENDPOINTS.adminUsers,
      { params: toQueryParams(query), signal: controller.signal },
    );
    dispatch(usersSuccess(response.data));
    return response.data;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(usersFail(extractError(error, "Could not load users")));
  } finally {
    listRequest.finish(controller);
  }
};

export const fetchUserDetail =
  (id: number, page = 1) =>
  async (dispatch: Dispatch) => {
    const controller = detailRequest.start();
    try {
      dispatch(userDetailStart(id));
      const response = await api.get<UserDetailResponse>(
        API_ENDPOINTS.adminUser(id),
        { params: { page }, signal: controller.signal },
      );
      dispatch(userDetailSuccess(response.data));
      return response.data;
    } catch (error) {
      if (isAbortError(error)) return;
      dispatch(userDetailFail(extractError(error, "Could not load this user")));
    } finally {
      detailRequest.finish(controller);
    }
  };
