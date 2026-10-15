import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { authErrorsCleared } from "../features/auth/slice";

/** Login and register both start with a clean slate, not the other page's errors. */
export const useClearAuthErrors = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(authErrorsCleared());
  }, [dispatch]);
};
