import { useAppSelector } from "../app/hooks";
import {
  selectAuthError,
  selectAuthFieldErrors,
  selectAuthStatus,
  selectBootstrapped,
  selectUser,
} from "../features/auth/selectors";

// One selector per field, so a component re-renders only when a value it uses changes.
export const useAuth = () => {
  const user = useAppSelector(selectUser);
  const bootstrapped = useAppSelector(selectBootstrapped);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const fieldErrors = useAppSelector(selectAuthFieldErrors);

  return {
    user,
    isAdmin: user?.role === "admin",
    bootstrapped,
    loading: status === "loading",
    error,
    fieldErrors,
  };
};
