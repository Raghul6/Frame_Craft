import type { Dispatch } from "@reduxjs/toolkit";
import api from "../../api/api";
import { API_ENDPOINTS } from "../../constants/api";
import type { DashboardStats } from "../../types/admin";
import { extractError, isAbortError } from "../../utils/apiError";
import { createLatestRequest } from "../shared/latestRequest";
import { dashboardFail, dashboardStart, dashboardSuccess } from "./slice";
import { LOAD_ERROR_MESSAGES } from "../../constants/messages";

const dashboardRequest = createLatestRequest();

export const fetchDashboard = () => async (dispatch: Dispatch) => {
  const controller = dashboardRequest.start();
  try {
    dispatch(dashboardStart());
    const response = await api.get<DashboardStats>(
      API_ENDPOINTS.adminDashboard,
      { signal: controller.signal },
    );
    dispatch(dashboardSuccess(response.data));
    return response.data;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(dashboardFail(extractError(error, LOAD_ERROR_MESSAGES.dashboard)));
  } finally {
    dashboardRequest.finish(controller);
  }
};
