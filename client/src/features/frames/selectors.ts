import type { RootState } from "../../types/store";

export const selectFramesList = (state: RootState) => state.frames.list;
export const selectCurrentFrame = (state: RootState) => state.frames.current;
export const selectFrameSave = (state: RootState) => state.frames.save;
export const selectFrameRemove = (state: RootState) => state.frames.remove;
