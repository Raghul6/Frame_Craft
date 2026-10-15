import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Frame } from "../../types/admin";
import type { Paginated, RequestError } from "../../types/api";
import type { FramesState } from "../../types/state";
import { logoutSuccess } from "../auth/slice";
import {
  createListState,
  listFailed,
  listLoaded,
  listStarted,
} from "../shared/listState";

const initialState: FramesState = {
  list: createListState<Frame>(),
  current: { frame: null, status: "idle", error: null },
  save: { status: "idle", error: null, fieldErrors: {} },
  remove: { id: null, error: null },
};

const framesSlice = createSlice({
  name: "frames",
  initialState,
  reducers: {
    framesStart: (state) => {
      listStarted(state.list);
      state.remove.error = null;
    },
    framesSuccess: (state, action: PayloadAction<Paginated<Frame>>) =>
      listLoaded(state.list, action.payload),
    framesFail: (state, action: PayloadAction<string>) =>
      listFailed(state.list, action.payload),

    frameStart: (state) => {
      state.current = { frame: null, status: "loading", error: null };
      state.save = { status: "idle", error: null, fieldErrors: {} };
    },
    frameSuccess: (state, action: PayloadAction<Frame>) => {
      state.current = {
        frame: action.payload,
        status: "succeeded",
        error: null,
      };
    },
    frameFail: (state, action: PayloadAction<string>) => {
      state.current = { frame: null, status: "failed", error: action.payload };
    },

    frameSaveStart: (state) => {
      state.save = { status: "loading", error: null, fieldErrors: {} };
    },
    frameSaveSuccess: (state, action: PayloadAction<Frame>) => {
      state.save.status = "succeeded";
      state.current = {
        frame: action.payload,
        status: "succeeded",
        error: null,
      };
      const index = state.list.items.findIndex(
        (f) => f.id === action.payload.id,
      );
      if (index >= 0) state.list.items[index] = action.payload;
    },
    frameSaveFail: (state, action: PayloadAction<RequestError>) => {
      state.save = {
        status: "failed",
        error: action.payload.message,
        fieldErrors: action.payload.fieldErrors,
      };
    },
    frameSaveErrorsCleared: (state) => {
      state.save.error = null;
      state.save.fieldErrors = {};
    },

    frameDeleteStart: (state, action: PayloadAction<number>) => {
      state.remove = { id: action.payload, error: null };
    },
    frameDeleteSuccess: (state, action: PayloadAction<number>) => {
      state.remove.id = null;
      state.list.items = state.list.items.filter(
        (f) => f.id !== action.payload,
      );
      state.list.total = Math.max(0, state.list.total - 1);
    },
    frameDeleteFail: (state, action: PayloadAction<string>) => {
      state.remove = { id: null, error: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutSuccess, () => initialState);
  },
});

export const {
  framesStart,
  framesSuccess,
  framesFail,
  frameStart,
  frameSuccess,
  frameFail,
  frameSaveStart,
  frameSaveSuccess,
  frameSaveFail,
  frameSaveErrorsCleared,
  frameDeleteStart,
  frameDeleteSuccess,
  frameDeleteFail,
} = framesSlice.actions;
export default framesSlice.reducer;
