import type { Dispatch } from "@reduxjs/toolkit";
import api from "../../api/api";
import { API_ENDPOINTS } from "../../constants/api";
import type { Frame, FrameInput, FrameResponse } from "../../types/admin";
import type { ListQuery, Paginated } from "../../types/api";
import {
  extractError,
  isAbortError,
  toRequestError,
} from "../../utils/apiError";
import { LOAD_ERROR_MESSAGES, TOAST_MESSAGES } from "../../constants/messages";
import { createLatestRequest, toQueryParams } from "../shared/latestRequest";
import { showToast } from "../toast/thunks";
import {
  frameDeleteFail,
  frameDeleteStart,
  frameDeleteSuccess,
  frameFail,
  frameSaveFail,
  frameSaveStart,
  frameSaveSuccess,
  framesFail,
  framesStart,
  framesSuccess,
  frameStart,
  frameSuccess,
} from "./slice";

const listRequest = createLatestRequest();
const detailRequest = createLatestRequest();

export const fetchFrames = (query: ListQuery) => async (dispatch: Dispatch) => {
  const controller = listRequest.start();
  try {
    dispatch(framesStart());
    const response = await api.get<Paginated<Frame>>(
      API_ENDPOINTS.adminFrames,
      { params: toQueryParams(query), signal: controller.signal },
    );
    dispatch(framesSuccess(response.data));
    return response.data;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(framesFail(extractError(error, LOAD_ERROR_MESSAGES.frames)));
  } finally {
    listRequest.finish(controller);
  }
};

export const fetchFrame = (id: number) => async (dispatch: Dispatch) => {
  const controller = detailRequest.start();
  try {
    dispatch(frameStart());
    const response = await api.get<FrameResponse>(
      API_ENDPOINTS.adminFrame(id),
      {
        signal: controller.signal,
      },
    );
    dispatch(frameSuccess(response.data.frame));
    return response.data.frame;
  } catch (error) {
    if (isAbortError(error)) return;
    dispatch(frameFail(extractError(error, LOAD_ERROR_MESSAGES.frame)));
  } finally {
    detailRequest.finish(controller);
  }
};

// Create (no id) or update (id) — same request lifecycle, so one thunk.
export const saveFrame =
  (input: FrameInput, id?: number) =>
  async (dispatch: Dispatch): Promise<Frame | undefined> => {
    try {
      dispatch(frameSaveStart());
      const response = id
        ? await api.put<FrameResponse>(API_ENDPOINTS.adminFrame(id), input)
        : await api.post<FrameResponse>(API_ENDPOINTS.adminFrames, input);
      const frame = response.data.frame;
      dispatch(frameSaveSuccess(frame));
      showToast(
        dispatch,
        "success",
        id
          ? TOAST_MESSAGES.frameSaved(frame.name)
          : TOAST_MESSAGES.frameCreated(frame.name),
      );
      return frame;
    } catch (error) {
      const failure = toRequestError(error, TOAST_MESSAGES.frameSaveFailed);
      dispatch(frameSaveFail(failure.fieldErrors));
      showToast(dispatch, "error", failure.message);
    }
  };

export const deleteFrame =
  (id: number, name: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      dispatch(frameDeleteStart(id));
      await api.delete(API_ENDPOINTS.adminFrame(id));
      dispatch(frameDeleteSuccess());
      showToast(dispatch, "success", TOAST_MESSAGES.frameDeleted(name));
      return true;
    } catch (error) {
      dispatch(frameDeleteFail());
      showToast(
        dispatch,
        "error",
        extractError(error, TOAST_MESSAGES.frameDeleteFailed),
      );
      return false;
    }
  };
